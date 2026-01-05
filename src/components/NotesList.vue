

<template>

  <div class="app">
    <h2>My Notes</h2>

    <div class="search-box">
      <input v-model="searchString" type="text" placeholder="Search notes..." />
    </div>



    <ul v-if="notes.length" class="notes-list">
      <li v-for="note in notes" class="note-item">
        <div class="note-header">
          <span class="note-title"> {{ note.title }} </span>
          <div class="note-actions">
            <button @click="editNotes(note.id)" class="edit">&#9998;</button>
            <button @click="deleteNotes(note.id)" class="delete">&#10060;</button>
          </div>
        </div>
        <div class="note-description">
          {{ note.description }}
        </div>
      </li>
    </ul>

    <p v-else style="text-align: center" >
      No notes found.
    </p>


    <button @click="createNotes" class="add-btn">+</button>

  </div>

</template>

<script setup>

 // imports
 import {onMounted, ref, watch, watchEffect} from "vue";
 import { collection, deleteDoc, getDocs, doc, query, where } from "firebase/firestore";
 import { db } from "@/services/firebase";
 import {useRouter} from "vue-router";
 import {useToast} from "vue-toastification";


 // variable declaration
 const notes = ref([]);
 const allNotes = ref([]);
 const error = ref("");
 const isLoading = ref(false);
 const  router = useRouter();
 const searchString = ref("");
 const toast = useToast();


 const test = async () => {
   const snap = await getDocs(collection(db, "notes"));
   console.log("Firestore connected, docs:", snap.size);
 };

 test()

 watch(searchString, (newVal) => {
   if (newVal) {
     notes.value = allNotes.value.filter(note =>
         note.title.toLowerCase().includes(newVal.toLowerCase())
     )
   } else {
     notes.value = allNotes.value
   }
 })

 async function editNotes(id) {
   router.push(`/edit/${id}`);
 }

 async function deleteNotes(id) {
   try {
     isLoading.value = true;
     await deleteDoc( doc(db, 'notes', id) );
     toast.success("Note deleted");
     await getNotes()
   } catch (e) {
     error.value = err.message;
   }

 }

 onMounted(async () => {
     await getNotes();
 })

 async function getNotes() {
   isLoading.value = true;
   const userId = localStorage.getItem("user_uid");
   console.log(userId);
   try {

     const notesQuery = query(
         collection(db, "notes"),
         where("userId", "==", userId)  // <-- filter by current user
     );

     const snap = await getDocs(notesQuery);
     console.log("Firestore docs:", snap.docs.map(doc => doc.data()));
     notes.value = snap.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     }));

     console.log(notes.value)

     allNotes.value = notes.value

   } catch (err) {
     error.value = err.message;
   } finally {
     isLoading.value = false;
   }
 }

 function createNotes(){
   router.push("/create");
 }

</script>


<style scoped>
.app {
  background: #ffffff;
  width: 420px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  padding: 20px 24px 26px;
  position: relative;
}

.app h2 {
  margin: 0 0 12px;
  font-size: 20px;
}

.search-box input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 14px;
  box-sizing: border-box; /* ✅ prevents overflow */
}
.notes-list {
  margin-top: 16px;
  list-style: none;
  padding: 0;
}

.note-item {
  background: #fafafa;
  border: 1px solid #e2e2e2;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.note-description {
  margin-top: 6px;
  font-size: 13px;
  color: #555;
}

.note-actions button {
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 16px;
  margin-left: 8px;
  color: #555;
}

.note-actions button:hover.delete {
  color: #cc0000;
}

.note-actions button:hover.edit {
  color: #007bff;
}
/* 🔹 Bottom-left Add Button */
.add-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #007bff;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 18px rgba(0,0,0,0.18);
}

.add-btn:hover {
  background: #0063d6;
}

</style>