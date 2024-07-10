class Permissions {
    constructor(usersRoles) {
        this.usersRoles = usersRoles;
    }
    addRoleParents(targetRole, sourceRole) {
        const targetData = this.usersRoles.find(v => v.role === targetRole);
        const sourceData = this.usersRoles.find(v => v.role === sourceRole);
        targetData.allows = targetData.allows.concat(sourceData.allows);
    }
    isResourceAllowedForUser(userRole, resource, method) {
        // sprawdza czy user o okreslonej roli może mieć dostep do resource
        // zwraca false jesli nie ma dostępu, true jeśli ma dostep
        const roleData = this.usersRoles.find(v => v.role === userRole);
        if (!roleData) {
            return false; // brak dostepu bo nie ma takiej roli obsługiwanej na serwerze
        }
        const resourceData = roleData.allows.find(v => v.resource === resource);
        if (!resourceData) {
            return false; // osoba o tej roli nie ma info o tym adresie wiec nie ma dostępu
        }
        if (!resourceData.permissions) {
            return false; // nie ma dostepu bo nie ma opisanych dozwolonyc metod
        }
        if (!Array.isArray(resourceData.permissions)) {
            if (resourceData.permissions == '*')
                return true;
            if (resourceData.permissions === method)
                return true;
        }
        else {
            // tablica
            if (resourceData.permissions.find(v => v === '*'))
                return true;
            if (resourceData.permissions.find(v => v === method))
                return true;
        }
        return false;
    }
}
;
const usersRoles = [
    {
        role: "admin",
        allows: [
            { resource: '/admin/users', permissions: '*' }, // * to wszystkie metody jak: get, post
            { resource: '/admin/users/add', permissions: '*' },
            { resource: '/admin/users/edit', permissions: '*' },
            { resource: '/admin/users/edit/:id', permissions: '*' },
        ]
    },
    {
        role: "user",
        allows: [
            { resource: "/dashboard", permissions: ["post", "get"] }
        ]
    },
    {
        role: "guest",
        allows: []
    }
];
const permissions = new Permissions(usersRoles);
permissions.addRoleParents("admin", "user");
// console.log(JSON.stringify(permissions.usersRoles, null, 4));
// console.log(permissions.isResourceAllowedForUser("admin", "/admin/users", "get"));
export { permissions };
