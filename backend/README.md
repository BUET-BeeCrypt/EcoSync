# Team name: BUET STORM'S END

__Instiution__: Bangladesh University of Engineering and Technology

__Emails__:

- [tamimehsan99@gmail.com](mailto:tamimehsan99@gmail.com)
- [sabit.jehadul.karim@gmail.com](mailto:sabit.jehadul.karim@gmail.com)
- [hasanmasum1852@gmail.com](mailto:hasanmasum1852@gmail.com)

## Instructions

### Run with Docker

```bash
docker build -t stormsend .
docker run -p 8000:8000 stormsend
```

#### Run with Docker Compose

```bash
docker compose up -d --build
```

Then you can access the api through port 8000

#### Run test

At first install dev dependencies and then run test by npm

```bash
npm install --save-dev jest
npm test
```
