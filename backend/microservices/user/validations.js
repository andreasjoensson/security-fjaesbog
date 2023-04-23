module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Brugernavn må ikke være tomt';
    }
    if (password.trim() === '') {
      errors.password = 'Password må ikke være tomt';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };