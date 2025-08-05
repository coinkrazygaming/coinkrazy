// Quick fix for admin user via API call

async function fixAdminUser() {
  try {
    const response = await fetch('http://localhost:8080/api/admin/init-admin-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    console.log('Admin user fix result:', data);
    
    if (data.success) {
      console.log('✅ Admin user fixed successfully!');
    } else {
      console.log('❌ Failed to fix admin user:', data.message);
    }
  } catch (error) {
    console.error('Error fixing admin user:', error);
  }
}

fixAdminUser();
