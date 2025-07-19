// Test login with admin credentials
const testLogin = async () => {
  const loginData = {
    email: "vipmember@example.com",
    password: "password123"
  };

  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response:', result);
    
    if (response.ok) {
      console.log('Login successful:', result);
    } else {
      console.error('Login failed:', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testLogin();
