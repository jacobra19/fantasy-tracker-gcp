![console error](https://github.com/jacobra19/fantasy-tracker-firebase/blob/main/error.png?raw=true)

1) convert sample.env to .env


2) in functions/index.js, change cronFormat variable as you wish
```
    const cronFormat = '30 * * * *'
``` 

3) check link: https://github.com/firebase/firebase-functions/issues/611