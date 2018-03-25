# puppet

Script sujo que tropeça pelo seu perfil do facebook**, tentando deletar
o que vier pela frente.

** (Usando uma ferramenta de teste E2E que vai clicando na página)

## Uso

Crie um arquivo `config.js` dentro da pasta `built`.

```javascript
module.exports = {
    username: 'username',
    password: 'password',
    profile: 'profile',
    skip: []
}
```

```
npm i
cd built
node index
```