export const api = {
    generateTitle: async (data: any) => {
        const res = await fetch('/api/generate-title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    generateOutline: async (data: any) => {
        const res = await fetch('/api/generate-outline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    generateBody: async (data: any) => {
        const res = await fetch('/api/generate-body', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
};
