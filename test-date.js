import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1d' });

async function main() {
    try {
        const response = await fetch('http://127.0.0.1:5003/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ task: 'Test Date', dueDate: '2026-05-15T00:00:00.000Z' })
        });
        const data = await response.json();
        console.log("Create response:", data);
        
        const getResponse = await fetch('http://127.0.0.1:5003/todos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const getData = await getResponse.json();
        const testDateTask = getData.find(t => t.id === data.id);
        console.log("Get response has dueDate?", !!testDateTask?.dueDate, testDateTask?.dueDate);
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
main();
