enum Role {
    Owner = "owner",
    Employee = "employee"
}

type LoginResponse = {
    token: string,
    username: string,
    name: string,
    id: string,
    role: Role
}