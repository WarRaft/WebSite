navigator.serviceWorker
    .register('./sw.js', {scope: './'})
    .then(reg => {
        if (0) console.log('Registration succeeded. Scope is ' + reg.scope)
    })
    .catch(error => {
        console.log('Registration failed with ' + error)
    })
