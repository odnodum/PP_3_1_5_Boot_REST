let tableUsers = [];
let currentUser = "";
let headerUserInfo = document.getElementById("headerUserInfo");
let deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
let editModal = new bootstrap.Modal(document.getElementById('editModal'));
let request = new Request("http://localhost:8888/api/users", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
});

fetch(request).then(
    res => {
        res.json().then(
            data => {
                if (data.length > 0) {
                    data.forEach((user) => {
                        if (user.id != null) {
                            tableUsers.push(user)
                        }
                    })
                    console.log(tableUsers);
                    showUsers(tableUsers);
                }
            }
        )
    }
)

function showUsers(event) {
    let temp = "";
    console.log(event);
    event.forEach((user) => {
        temp += "<tr>"
        temp += "<td>" + user.id + "</td>"
        temp += "<td>" + user.name + "</td>"
        temp += "<td>" + user.surname + "</td>"
        temp += "<td>" + user.age + "</td>"
        temp += "<td>" + user.email + "</td>"
        temp += "<td>" + getRoles(user.roles) + "</td>"
        temp += "<td>" + `<a onclick='showEditModal(${user.id})' class="btn btn-primary" id="edit">Edit</a>` + "</td>"
        temp += "<td>" + `<a onclick='showDeleteModal(${user.id})' class="btn btn-danger" id="deleteButton" >Delete</a>` + "</td>"
        temp += "</tr>"
    })
    document.getElementById("allUsersBody").innerHTML = temp;
}

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

function rolesUser(event) {
    let rolesAdmin = {};
    let rolesUser = {};
    let roles = [];
    let allRoles = [];
    let sel = document.querySelector(event);
    for (let i = 0, n = sel.options.length; i < n; i++) {
        if (sel.options[i].selected) {
            roles.push(sel.options[i].value);
        }
    }
    if (roles.includes('2')) {
        rolesAdmin["id"] = 2;
        rolesAdmin["name"] = "ROLE_ADMIN";
        allRoles.push(rolesAdmin);
    }
    if (roles.includes('1')) {
        rolesUser["id"] = 1;
        rolesUser["name"] = "ROLE_USER";
        allRoles.push(rolesUser);
    }
    return allRoles;
}

document.getElementById('newUser').addEventListener('submit', addNewUser);

function addNewUser(e) {
    e.preventDefault();
    let newUserForm = new FormData(e.target);
    let user = {};
    newUserForm.forEach((value, key) => user[key] = value);
    user["roles"] = rolesUser("#roles");
    let request = new Request("http://localhost:8888/api/users", {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch(request).then(res => res.json()).then(newUser => {
            tableUsers.push(newUser);
            showUsers(tableUsers);
        }
    );
    e.target.reset();
    const triggerEl = document.querySelector('#home_page a[href="#tab-1"]')
    bootstrap.Tab.getInstance(triggerEl).show()
}


function submitFormDeleteUser(id) {
    let request = new Request('http://localhost:8888/api/users/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request);
}


function showDeleteModal(id) {
    let request = new Request("http://localhost:8888/api/users/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    fetch(request).then(res => res.json()).then(userDelete => {
            document.getElementById('nameDelete').setAttribute('value', userDelete.name);
            document.getElementById('surnameDelete').setAttribute('value', userDelete.surname);
            document.getElementById('ageDelete').setAttribute('value', userDelete.age);
            document.getElementById('emailDelete').setAttribute('value', userDelete.email);
            document.getElementById('passwordDelete').setAttribute('value', userDelete.password);
            if (getRoles(userDelete.roles).includes("USER") && getRoles(userDelete.roles).includes("ADMIN")) {
                document.getElementById('oneRoleDelete').setAttribute('selected', 'true');
                document.getElementById('twoRoleDelete').setAttribute('selected', 'true');
            } else if (getRoles(userDelete.roles).includes("USER")) {
                document.getElementById('oneRoleDelete').setAttribute('selected', 'true');
            } else if (getRoles(userDelete.roles).includes("ADMIN")) {
                document.getElementById('twoRoleDelete').setAttribute('selected', 'true');
            }
            deleteModal.show();
        }
    );

    document.getElementById('userDelete').addEventListener('submit', function (event) {
        event.preventDefault();
        submitFormDeleteUser(id);
        let deleteUser = tableUsers.find(item => item.id === id);
        tableUsers = tableUsers.filter(function (user) {
            return user !== deleteUser;
        })
        showUsers(tableUsers);
        deleteModal.hide();
    });
}

function showEditModal(id) {
    let request = new Request("http://localhost:8888/api/users/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request).then(res => res.json()).then(userEdit => {
            document.getElementById('idEdit').setAttribute('value', userEdit.id);
            document.getElementById('nameEdit').setAttribute('value', userEdit.name);
            document.getElementById('surnameEdit').setAttribute('value', userEdit.surname);
            document.getElementById('ageEdit').setAttribute('value', userEdit.age);
            document.getElementById('emailEdit').setAttribute('value', userEdit.email);
            document.getElementById('passwordEdit').setAttribute('value', userEdit.password);
            if ((userEdit.roles.id = 1) && (userEdit.roles.id = 2)) {
                document.getElementById('oneRoleDelete').setAttribute('selected', 'true');
                document.getElementById('twoRoleDelete').setAttribute('selected', 'true');
            } else if ((userEdit.roles.id = 1)) {
                document.getElementById('oneRoleDelete').setAttribute('selected', 'true');
            } else if ((userEdit.roles.id = 2)) {
                document.getElementById('twoRoleDelete').setAttribute('selected', 'true');
            }
            editModal.show();
        }
    );

    document.getElementById('userEdit').addEventListener('submit', submitFormEditUser);
}

function submitFormEditUser(event) {
    event.preventDefault();
    let redUserForm = new FormData(event.target);
    let user = {};
    redUserForm.forEach((value, key) => user[key] = value);
    user["roles"] = rolesUser("#rolesEdit");
    let request = new Request('http://localhost:8888/api/users/', {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    fetch(request).then(
        function (response) {
            console.log(response)
            let indexEditUser = tableUsers.findIndex(item => item.id === user["id"])
            tableUsers.splice(indexEditUser, 1, user)
            showUsers(tableUsers);
            editModal.hide();
        });
}



