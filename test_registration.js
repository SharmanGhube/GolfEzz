// Test registration with membership type
const testRegistration = async () => {
  const registrationData = {
    name: "VIP Member",
    email: "vipmember@example.com",
    password: "password123",
    role: "member",
    phone: "555-987-6543",
    address: "456 VIP Avenue",
    membership_type: "vip"
  };

  try {
    const response = await fetch('http://localhost:8080/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Registration successful:', result);
    } else {
      console.error('Registration failed:', result);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

testRegistration();
