let currentUser = "";
let headerUserInfo = document.getElementById("headerUserInfo");

fetch("http://localhost:8888/api/users/current").then(
    res => {
        res.json().then(
            data => {
                if (data != null) {
                    currentUser = data;
                    showOneUser(currentUser);
                }
            }
        )
    })

function showOneUser(event) {

    let temp = "";
    console.log(event);
    temp += "<tr>"
    temp += "<td>" + event.id + "</td>"
    temp += "<td>" + event.name + "</td>"
    temp += "<td>" + event.surname + "</td>"
    temp += "<td>" + event.age + "</td>"
    temp += "<td>" + event.email + "</td>"
    temp += "<td>" + getRoles(event.roles) + "</td>"
    temp += "</tr>"
    document.getElementById("oneUser").innerHTML = temp;
    headerUserInfo.innerHTML = `${event.email} with roles: ${getRoles(event.roles)}`;
}

function getRoles(list) {
    let userRoles = [];
    for (let role of list) {
        if (role == 2 || role.id == 2) {
            userRoles.push("ADMIN");
        }
        if (role == 1 || role.id == 1) {
            userRoles.push("USER");
        }
    }
    return userRoles.join(" , ");
}