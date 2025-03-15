import { useEffect, useState } from "react";

export function usePermission(role: string) {
    const [permission, setPermission] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPermissions() {
            const res = await fetch("http://alnubrasstudio.ddns.net/role", {
                credentials: 'include'
            });
            const data = await res.json();
            setPermission(data.role);
        }
        fetchPermissions();
    }, []);

    return permission === role;
}
