import {useState,useEffect} from 'react';
import './App.css';

function App(){
  
  const [notes,setNotes]=useState(()=>{
      const getFromLocalStorage = JSON.parse(localStorage.getItem('notes'))
      return getFromLocalStorage ? getFromLocalStorage : [];
    
  })
  
  const [text,setText] = useState("");

  const [editId,setEditId]=useState(null);
  const [editText,setEditText]=useState("");

  const [title,setTitle]=useState('');
  const [editTitle,setEditTitle]=useState(null);

  //updating localStorage whenever our notes change
  useEffect(()=>{
    const updatedNotes = JSON.stringify(notes);
    localStorage.setItem('notes',updatedNotes);
  },[notes])


  function updateInputText(event){
    setText(event.target.value);
  }


  function addNote(){
    // addTitle();
    if(text.trim().length == 0 ||  title.trim().length === 0) return ;

    const updatedNotes = [
      { id : Date.now(),noteTitle:title,noteText : text,pinned:false},
      ...notes
    ]

    setNotes(updatedNotes);
    setText("");
    setTitle("");
  }

  function deleteNote(id){
    const updatedNotes = notes.filter((note) => id!=note.id);
    const deleteConfirm = window.confirm("Are you sure you want to delete the note?")
    if(!deleteConfirm) return;
    setNotes(updatedNotes);
  }

  function DeleteNote({noteId}){
    return <button onClick={()=>deleteNote(noteId)}>Delete</button>
  }

  function SaveNote({id}){
    return <button onClick={()=>saveEdit(id)}> Save</button>
  }
  function CancelEdit(){
    return <button onClick={()=> setEditId(null)}>Cancel</button>
  }
  //save updated  notes
  function saveEdit(id){
    const updatedNotes = notes.map(note =>
      editId===id?{...note,noteTitle:editTitle,noteText:editText}:note
    )

    setNotes(updatedNotes);
    setEditId(null);
    setEditText("");
  }

  function startEdit(note){
    setEditId(note.id);
    setEditText(note.noteText);
    setEditTitle(note.noteTitle);

  }

  function PinButton({id,pinned}){
   let pinStatus = pinned?“unpin":"pin";
   
    return <button onClick={()=>togglePinned(id)}>{pinStatus}</button>
  }
  function togglePinned(id){
    const updatedNotes=notes.map(note=> {
      return id==note.id ? {...note,pinned:!note.pinned}:note
    })
    setNotes(updatedNotes);
  }

  const sortedMap=[...notes].sort((a,b)=>{
    if(a.pinned === b.pinned) return 0;
    return a.pinned ? -1 : 1;
  })

  return (
    <div className="container" >
      <h1>QuickNote🗒️</h1>
      <input 
      value={title}
      type="text"
      placeholder='Enter title...'
      onChange={e=> setTitle(e.target.value)} /> <br />
      <textarea
        onChange={updateInputText}
        value={text}
        placeholder="Enter your note here....."
        rows='4'
        cols='30'
      ></textarea>
      <button
        onClick={addNote}
        disabled={text.trim().length == 0}
      >Add Note</button>
      <ul>
        {notes.length>0?
          (
            sortedMap.map(note=>{
              return <li key={note.id} className={note.pinned ? "pinned" : "" }> {note.id==editId?
                (
                  <>
                  <input type="text" 
                    onChange={e=> setEditTitle(e.target.value)}
                    value={editTitle}
                  /> <br />
                  <textarea
                    onChange={(e)=> setEditText(e.target.value)}
                    value={editText}
                    cols='30'
                    rows='3'
                  ></textarea>
                  <SaveNote id={note.id}/>
                  <CancelEdit />
                  </>
                ):(
                  <>
                  <h3>{note.noteTitle}{note.pinned && '📌'}</h3>
                  <pre>{note.noteText}</pre >
                  <br />
                  <button onClick={()=>startEdit(note)}>Edit</button>
                  <DeleteNote noteId={note.id}/>
                  <PinButton id={note.id}  pinned={note.pinned}/>
                  </>
                )}</li>;


            
              })
          ): <p>No notes!!</p>}
      </ul>
    </div>
  );

}

export default App;
