// Create basic member user
const createBasicMember = async () => {
  const memberData = {
    name: "Basic Member",
    email: "basicmember@example.com",
    password: "password123",
    role: "member",
    phone: "555-111-2222",
    address: "789 Basic Street",
    membership_type: "basic"
  };

  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Basic member creation response:', result);
    
    if (response.ok) {
      console.log('Basic member created successfully!');
      
      // Now test login
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "basicmember@example.com",
          password: "password123"
        })
      });

      const loginResult = await loginResponse.json();
      console.log('Login status:', loginResponse.status);
      console.log('Login result membership_type:', loginResult.user?.membership_type);
      
    } else {
      console.error('Basic member creation failed:', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

createBasicMember();
