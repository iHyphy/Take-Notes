let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;
let activeNote = {}; // Ensure activeNote is defined to manage the current note

// If we're on the notes page, assign the elements to these variables
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('#note-title');
  noteText = document.querySelector('#note-textarea');
  saveNoteBtn = document.querySelector('#save-note');
  newNoteBtn = document.querySelector('#new-note');
  noteList = document.querySelector('#note-list');

  const renderActiveNote = () => {
    if (activeNote.id) {
      // Display the active note's title and text
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
      saveNoteBtn.style.display = "none"; // Hide the save button if viewing an existing note
    } else {
      // Clear the form for a new note
      noteTitle.value = '';
      noteText.value = '';
      saveNoteBtn.style.display = "inline"; // Show the save button for a new note
    }
  };

  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };
    fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    })
      .then((response) => response.json())
      .then(() => {
        getAndRenderNotes();
        renderActiveNote();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const createNoteListItem = (note) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerText = note.title;
    li.addEventListener('click', () => {
      activeNote = note;
      renderActiveNote();
    });
    return li;
  };

  // Get and render the note list
  const getAndRenderNotes = () => {
    fetch('/api/notes', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const noteItems = data.map((note) => createNoteListItem(note));
        noteList.innerHTML = '';
        noteItems.forEach((note) => noteList.appendChild(note));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Event listeners
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', () => {
    activeNote = {}; // Reset activeNote for a new note
    renderActiveNote();
  });

  // Ensures notes are rendered upon visiting the notes page
  getAndRenderNotes();
};
