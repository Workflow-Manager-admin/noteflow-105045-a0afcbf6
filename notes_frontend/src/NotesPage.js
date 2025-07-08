import React, { useCallback, useEffect, useState } from "react";
import { getToken } from "./auth";
import Modal from "./Modal";
import "./NotesPage.css";

/**
 * Main notes listing page, CRUD, filter, search, modal logic
 */
// PUBLIC_INTERFACE
export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("create"); // create or edit
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const c = filterCat ? (q ? "&" : "?") + `category=${encodeURIComponent(filterCat)}` : "";
      const res = await fetch(`/api/notes${q}${c}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setNotes(data.notes || []);
      // Extract categories from notes
      const cats = Array.from(new Set((data.notes || []).map((n) => n.category).filter(Boolean)));
      setCategories(cats);
    } catch {
      setNotes([]);
    }
    setLoading(false);
  }, [search, filterCat]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // PUBLIC_INTERFACE
  const openCreateModal = () => {
    setMode("create");
    setSelectedNote(null);
    setShowModal(true);
  };

  // PUBLIC_INTERFACE
  const openEditModal = (note) => {
    setMode("edit");
    setSelectedNote(note);
    setShowModal(true);
  };

  // PUBLIC_INTERFACE
  const closeModal = () => {
    setShowModal(false);
  };

  // PUBLIC_INTERFACE
  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchNotes();
  };

  // PUBLIC_INTERFACE
  const handleSave = async (note) => {
    if (mode === "create") {
      await fetch(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(note),
      });
    } else {
      await fetch(`/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(note),
      });
    }
    closeModal();
    fetchNotes();
  };

  // PUBLIC_INTERFACE
  const handleSearchChange = e => {
    setSearch(e.target.value);
  };

  // PUBLIC_INTERFACE
  const handleFilterCatChange = e => {
    setFilterCat(e.target.value);
  };

  return (
    <div className="notes-layout">
      {/* Responsive sidebar for categories/tags */}
      <aside className="sidebar">
        <h3>Categories</h3>
        <button
          className={`chip ${filterCat === "" ? "active" : ""}`}
          onClick={() => setFilterCat("")}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c}
            className={`chip ${filterCat === c ? "active" : ""}`}
            onClick={() => setFilterCat(c)}
          >
            {c}
          </button>
        ))}
      </aside>
      <section className="main-notes">
        <div className="notes-header-bar">
          <input
            className="search"
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search notes..."
            aria-label="Search notes"
          />
        </div>
        <div className="notes-list">
          {loading ? (
            <p>Loading…</p>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 40, color: "#888" }}>No notes found.</div>
          ) : (
            notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => openEditModal(note)}
                onDelete={() => handleDelete(note.id)}
              />
            ))
          )}
        </div>
      </section>
      {/* Floating action button */}
      <button className="fab" title="Add Note" onClick={openCreateModal}>
        +
      </button>
      <Modal open={showModal} onClose={closeModal}>
        <NoteForm
          mode={mode}
          note={selectedNote}
          onSubmit={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

/**
 * A single note card component
 */
function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <div className="note-card-content">
        <header>
          <h4>{note.title}</h4>
          {note.category && (
            <span className="chip" style={{ fontSize: ".82em", marginLeft: 4 }}>
              {note.category}
            </span>
          )}
        </header>
        <div className="note-body">{note.body}</div>
        <footer className="note-actions">
          <button className="btn btn-small" onClick={onEdit}>Edit</button>
          <button className="btn btn-small btn-danger" onClick={onDelete}>Delete</button>
        </footer>
      </div>
    </article>
  );
}

/**
 * Note form used in modal for create/edit
 */
function NoteForm({ mode, note, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: note?.title || "",
    body: note?.body || "",
    category: note?.category || "",
  });
  const [submitting, setSubmitting] = useState(false);

  // PUBLIC_INTERFACE
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h3>{mode === "create" ? "New Note" : "Edit Note"}</h3>
      <input
        name="title"
        className="input"
        type="text"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
        maxLength={100}
      />
      <textarea
        name="body"
        className="input textarea"
        value={form.body}
        onChange={handleChange}
        placeholder="Note body"
        required
        maxLength={2000}
        rows={5}
      />
      <input
        name="category"
        className="input"
        type="text"
        value={form.category}
        onChange={handleChange}
        placeholder="Category (optional)"
        maxLength={30}
      />
      <div className="modal-actions">
        <button type="button" className="btn btn-link" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
