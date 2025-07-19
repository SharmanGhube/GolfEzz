// Create admin user
const createAdminUser = async () => {
  const adminData = {
    name: "Golf Course Administrator",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  };

  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Admin creation response:', result);
    
    if (response.ok) {
      console.log('Admin user created successfully!');
      
      // Now test login
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "admin@example.com",
          password: "admin123"
        })
      });

      const loginResult = await loginResponse.json();
      console.log('Login status:', loginResponse.status);
      console.log('Login result:', loginResult);
      
    } else {
      console.error('Admin creation failed:', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

createAdminUser();
