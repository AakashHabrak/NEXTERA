// Test registration endpoint
// Using built-in fetch in Node.js 18+

async function testRegistration() {
    try {
        console.log('Testing registration endpoint...');
        
        const testData = {
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'TestPassword123!',
            newsletter: true
        };

        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Response:', result);
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testRegistration();
