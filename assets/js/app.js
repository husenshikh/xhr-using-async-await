const cl= console.log;


const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl= document.getElementById('content');
const userIdControl= document.getElementById('userId');
const cardContainer = document.getElementById('cardContainer');
const submitBtn = document.getElementById("submitBtn")
const updateBtn = document.getElementById("updateBtn")
const loader= document.getElementById('loader');

const baseUrl= `https://jsonplaceholder.typicode.com`;

const postUrl= `${baseUrl}/posts/`;

const onDelete = (ele) => {
    Swal.fire({
        title: "Do you want to remove this post?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        denyButtonText: `Don't remove`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let deleteId = ele.closest(".card").id;
            cl(deleteId)
            let deleteUrl = `${baseUrl}/posts/${deleteId}`;
            try{
                let res = makeApiCAll("DELETE",deleteUrl);
                document.getElementById(deleteId).remove()
            }
            catch(err){
                cl(err)
            }
            finally{
                loader.classList.add("d-none")
                Swal.fire({
                    title : `Post is Deleted Successfully !!!`,
                    icon : `success`,
                    timer : 2000
                })
            }
    } 

  })

}

const onEdit = async (ele) => {                                //fifth step edit post and patch on form
   let editId = ele.closest(".card").id;
  // cl(editId)
  localStorage.setItem("editId",editId);
   let editUrl = `${baseUrl}/posts/${editId}`;
   //cl(editUrl)

   try{
    let data = await makeApiCAll("GET",editUrl);
   // cl(data);
    titleControl.value = data.title;
    contentControl.value = data.body;
    userIdControl.value = data.userId;

    updateBtn.classList.remove("d-none");
    submitBtn.classList.add("d-none")
   }
   catch(err){
    cl(err)
   }
   finally{
    loader.classList.add("d-none");
   }
 
}

const createCard = (obj) => {                       // fourth step creat single card on ui
    let card = document.createElement("card");
    card.className = "card mb-4";
    card.id = obj.id;
    card.innerHTML = ` 
                    <div class="card-header">
                        <h4 class="m-0">${obj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onclick ="onEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick ="onDelete(this)">Delete</button>
                    </div> 
                    `
                    cardContainer.append(card)
}

const templatingofCards = (arr) => {              // second step templating of cards
    cardContainer.innerHTML = arr.map(obj => {
        return ` 
                 <div class="card mb-4" id="${obj.id}">
                    <div class="card-header">
                        <h4 class="m-0">${obj.title}</h4>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${obj.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-primary" onclick ="onEdit(this)">Edit</button>
                    <button class="btn btn-danger" onclick ="onDelete(this)">Delete</button>
                    </div>    
                </div>
                `
    }).join("")
}

function makeApiCAll(mathodName, apiurl, msgBody = null) {           // first step creat instance and genric function
    return new Promise((resolve, reject) => {
        loader.classList.remove("d-none");
        let xhr = new XMLHttpRequest();
        xhr.open(mathodName, apiurl);
        xhr.send(JSON.stringify(msgBody));
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {
                resolve(JSON.parse(xhr.response));
            }
            else {
                reject(`something went wrong`);
            }
        };
    });
}

async function fetchPosts() {
   try{
    let data = await makeApiCAll("GET",postUrl)
    templatingofCards(data)
   
   }
   catch (err){
    cl(err)
   }
   finally{
    loader.classList.add("d-none")
   }
}

fetchPosts()

const onPostSubmit = async (eve) => {                 // third step submit post in the database
    eve.preventDefault();
   try{
    let newPost = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    cl(newPost)

   let res = await makeApiCAll("POST",postUrl,newPost);
    //cl(res)
    newPost.id = res.id
    createCard(newPost)
    Swal.fire({
        title : `Post is Submited Successfully !!!`,
        icon : `success`,
        timer : 2000
    })
   
   }
   catch(err){
    cl(err)
   }
   finally{
    loader.classList.add("d-none")
   }
}

const onPostUpdate = async () => {                  //sixth step updateobj send in database and update in ui
    let updatedObj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    cl(updatedObj)
    let updateId = localStorage.getItem("editId");
    let updateUrl = `${baseUrl}/posts/${updateId}`;

    try{
       let res= await makeApiCAll("PATCH",updateUrl,updatedObj);
       cl(res)
       let card = [...document.getElementById(updateId).children]
       card[0].innerHTML = `<h4 class="m-0">${updatedObj.title}</h4>`
       card[1].innerHTML = `<p class="m-0">${updatedObj.body}</p>`

       Swal.fire({
        title : `Post is Updated Successfully !!!`,
        icon : `success`,
        timer : 2000
    })
    }
    catch(err){
        cl(err)
    }
    finally{
        loader.classList.add("d-none");
        postForm.reset()

        submitBtn.classList.remove("d-none")
        updateBtn.classList.add("d-none")
    }

}

postForm.addEventListener("submit",onPostSubmit);
updateBtn.addEventListener("click",onPostUpdate)