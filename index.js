const BASE_URL = "http://localhost:8000"

let mode = "CREATE"
let selectedId = ''

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log('id', id);
  if (id) {
    mode = "EDIT"
    selectedId = id;

    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      const user = response.data

      let firstNameDOM = document.querySelector('input[name=firstname]')
      let lastNameDOM = document.querySelector('input[name=lastname]')
      let ageDOM = document.querySelector('input[name=age]')
      let descriptionDOM = document.querySelector('textarea[name=description]')

      firstNameDOM.value = user.firstname
      lastNameDOM.value = user.lastname
      ageDOM.value = user.age
      descriptionDOM.value = user.description

      let genderDOMs = document.querySelectorAll('input[name=gender]')
      let interestDOMs = document.querySelectorAll('input[name=interest]')

      Array.from(genderDOMs).forEach(gender => {
        if (gender.value === user.gender) {
          gender.checked = true
        }
      })

      Array.from(interestDOMs).forEach(interest => {
        if (user.interests.includes(interest.value)) {
          interest.checked = true
        }
      })
    } catch (error) {
      console.log('error', error);
    }
  }
}

const validateData = (userData) => {
  let errors = []
  if (!userData.firstname) {
    errors.push("กรุณาใส่ชื่อจริง")
  }
  if (!userData.lastname) {
    errors.push("กรุณาใส่นามสกุล")
  }
  if (!userData.age) {
    errors.push("กรุณาใส่อายุ")
  }
  if (!userData.gender) {
    errors.push("กรุณาใส่เพศ")
  }
  if (!userData.interests) {
    errors.push("กรุณาใส่ความสนใจ")
  }
  if (!userData.description) {
    errors.push("กรุณาใส่รายละเอียดของคุณ")
  }
  return errors
}

const submitData = async () => {
  let firstNameDOM = document.querySelector('input[name=firstname]')
  let lastNameDOM = document.querySelector('input[name=lastname]')
  let ageDOM = document.querySelector('input[name=age]')

  let genderDOM = document.querySelector('input[name=gender]:checked') || {}
  let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || {}

  let descriptionDOM = document.querySelector('textarea[name=description]')

  let interest = ''

  let messageDOM = document.getElementById("message");

  try {
    for (let i = 0; i < interestDOMs.length; i++) {
      interest += interestDOMs[i].value
      if (i != interestDOMs.length - 1) {
        interest += ', '
      }
    }

    let userData = {
      firstname: firstNameDOM.value,
      lastname: lastNameDOM.value,
      age: ageDOM.value,
      gender: genderDOM.value,
      description: descriptionDOM.value,
      interests: interest
    }

    let message = 'บันทึกข้อมูลเรียบร้อย'

    if (mode === "CREATE") {
      const response = await axios.post(`${BASE_URL}/users`, userData);
      console.log('response', response.data);
    } else {
      const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
      message = "แก้ไขข้อมูลเรียบร้อยแล้ว"
      console.log('response', response.data);
    }
    messageDOM.innerText = message
    messageDOM.className = "message success"
  } catch (error) {
    console.log("error message", error.message);
    console.log("error", error.errors);
    if (error.response) {
      console.log(error.response);
      error.message = error.response.data.message;
      error.errors = error.response.data.errors
    }
    let htmlData = '<div>'
    htmlData += `<div>${error.message}</div>`
    htmlData += "<ul>"
    error.errors.forEach(error => {
      htmlData += `<li>${error}</li>`
    })
    htmlData += "</ul>"
    htmlData += '</div>'
    messageDOM.innerHTML = htmlData
    messageDOM.className = "message danger"
  }
}