const BASE_URL = "http://localhost:8000"

window.onload = async () => {
  await loadData();
}

const loadData = async () => {
  const response = await axios.get(`${BASE_URL}/users`);
  console.log(response.data);

  const userDOM = document.getElementById("user");
  let htmlData = '<div>'
  response.data.forEach(user => {
    htmlData += `<div>
      ${user.id} ${user.firstname} ${user.lastname}
      <a href="index.html?id=${user.id}"><button>Edit</button></a>
      <button class='delete' data-id='${user.id}'>Delete</button>
    </div>`
  })
  htmlData += '</div>'

  userDOM.innerHTML = htmlData

  const deleteDOMs = document.getElementsByClassName("delete");
  Array.from(deleteDOMs).forEach(dom => {
    dom.addEventListener("click", async (event) => {
      const id = event.target.dataset.id;
      try {
        await axios.delete(`${BASE_URL}/users/${id}`);
        loadData(); // recursive function
      } catch (error) {
        console.log('error', error);
      }
    })
  })
}