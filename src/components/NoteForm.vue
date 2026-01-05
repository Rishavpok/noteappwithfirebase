
<template>
  <div class="form-card">
    <h2 class="form-title">Create New Note</h2>

     <form @submit.prevent="onSubmit" >
       <div class="field-group">
         <label>Title</label>
         <input v-model="title" type="text" class="input-box" placeholder="Enter note title" />

         <span class="error" >{{ titleError }}</span>

       </div>


       <div class="field-group">
         <label>Description</label>
         <textarea v-model="description" class="textarea-box" placeholder="Write your note here..."></textarea>

         <span class="error" >{{ descriptionError }}</span>

       </div>


       <div class="field-group">
         <label>Is Completed</label>
         <div class="toggle-row">
           <input v-model="isCompleted" type="checkbox" />
           <span>Mark as completed</span>
         </div>
         <span class="error" >{{ isCompletedError }}</span>
       </div>

       <div class="field-group">
         <label>Color / Category</label>
         <div class="color-row">
           <input v-model="category" type="color" value="#ffb703" />
           <span>Select note color</span>
         </div>
       </div>


       <div class="action-row">
         <button @click="resetForm" type="button" class="btn btn-cancel">Cancel</button>
         <button v-if="!editMode" type="submit" class="btn btn-submit" :disabled="isLoading" >
           {{ isLoading ? "Saving..." : "Save Note" }}
         </button>
         <button v-if="editMode" type="submit" class="btn btn-submit" :disabled="isLoading" >
           {{ isLoading ? "Saving..." : "Update Note" }}
         </button>
       </div>

     </form>


  </div>
</template>

<script setup lang="ts">

// imports
import * as yup from "yup";
import {useField, useForm} from "vee-validate";
import {onMounted, ref, watch} from "vue";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase"
import {useToast} from "vue-toastification";
import router from "@/router/index.ts";
import {useRoute} from "vue-router";
import {string} from "yup";

// variable declaration

const isLoading = ref(false)
const error = ref("")
const toast = useToast()
const editMode = ref(false)
const route = useRoute()
const note = ref<any>(null)


watch(note, (newNote) => {
  if(newNote){
    setValues({
      title: newNote.title,
      description: newNote.description,
      isCompleted: newNote.isCompleted,
      category: newNote.category
    });
  }
})

// form validation
 const schema = yup.object({
   title: yup.string().required("Title is required"),
   description: yup.string().required("Description is required"),
   isCompleted: yup.boolean().required("Is Completed"),
   category: yup.string()
 })

const { handleSubmit ,setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    isCompleted: false,
    category: "#ffb703",
  }
})

const { value : title , errorMessage : titleError  } = useField('title')
const { value : description , errorMessage : descriptionError  } = useField('description')
const { value : isCompleted , errorMessage : isCompletedError  } = useField('isCompleted')
const { value : category, errorMessage : categoryError } = useField('category')

const onSubmit = handleSubmit(async (values) => {
  const id = route.params.id as string;
  isLoading.value = true;
  error.value = "";

  try {
    if (editMode.value) {
      // 🔹 EDIT NOTE
      const docRef = doc(db, "notes", id);
      await updateDoc(docRef, {
        title: values.title,
        description: values.description,
        isCompleted: values.isCompleted,
        category: values.category || "#ffb703",
        updatedAt: Date.now(),
      });
      toast.success("Note updated successfully!");
    } else {
      // 🔹 CREATE NEW NOTE
      await addDoc(collection(db, "notes"), {
        title: values.title,
        description: values.description,
        isCompleted: values.isCompleted,
        category: values.category || "#ffb703",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      toast.success("Note created successfully!");
      resetForm();
    }

    // 🔹 Navigate back to list
    await router.push("/list");
  } catch (e: any) {
    error.value = e.message || "Something went wrong";
  } finally {
    isLoading.value = false;
  }
});


const { resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    isCompleted: false,
    title: "",
    category: "",
    description: "",
  }
})

onMounted( async () => {
  const  id = route.params.id as string;
  if(id) {
    isLoading.value = true;
    error.value = "";
    editMode.value = true;
    try {
      const docRef = doc(db, "notes", id); // get document reference
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        note.value = docSnap.data();
      } else {
        error.value = "Note not found";
      }
    } catch (e) {
      error.value = e.message || "Failed to fetch note";
    } finally {
      isLoading.value = false;
    }
  }

});

</script>

<style scoped>

.form-card {
  width: 460px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px 26px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.08);
}

.form-title {
  margin: 0 0 16px;
  font-size: 22px;
  font-weight: bold;
}

.field-group {
  margin-bottom: 16px;
}

.field-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

.input-box,
.textarea-box {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
  background: #fafafa;
}

.textarea-box {
  min-height: 110px;
  resize: vertical;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #fafafa;
}

.toggle-row input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #fafafa;
}

.color-row input[type="color"] {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: none;
  padding: 0;
  cursor: pointer;
}

.action-row {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn-cancel {
  background: #e6e6e6;
}

.btn-submit {
  background: #007bff;
  color: #fff;
}

.btn-submit:hover {
  background: #0064d1;
}

.error {
  text-align: center;
  color: red;
}

</style>