# Escuta Optima Check

Pesquisa pública e anônima com quem faz check-in. Não precisa de login: a página fica no GitHub Pages e as respostas vão para uma planilha Google só sua.

Arquivos:

- `index.html`: o formulário.
- `Code.gs`: o script que recebe as respostas e grava na planilha.

## 1. Planilha e script (Google)

1. Crie uma planilha no Google Drive, por exemplo "Escuta Optima Check".
2. Na planilha, abra **Extensões → Apps Script**. Apague o conteúdo, cole o arquivo `Code.gs` e salve.
3. Clique em **Implantar → Nova implantação** e, em "Selecionar tipo", escolha **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em **Implantar** e autorize o acesso à planilha quando o Google pedir.
5. Copie a **URL do app da Web**, que termina em `/exec`.

A aba "Respostas" é criada sozinha na primeira resposta.

## 2. Ligar a página à planilha

No `index.html`, procure esta linha:

```js
const ENDPOINT='COLE_AQUI_A_URL_DO_APPS_SCRIPT';
```

Troque o texto entre aspas pelo endereço copiado no passo 1.5.

## 3. Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `escuta-optima-check`).
2. Envie o `index.html` para a raiz. O `Code.gs` e este README são opcionais.
3. Em **Settings → Pages → Build and deployment**, escolha Source **Deploy from a branch**, branch **main** e pasta **/ (root)**, e salve.
4. Depois de um ou dois minutos, o endereço aparece no topo da mesma tela: `https://<seu-usuario>.github.io/escuta-optima-check/`.

## 4. Antes de divulgar

- Responda o formulário inteiro uma vez, confira se a linha apareceu na planilha e apague essa linha de teste.
- No GitHub gratuito, a página e o código ficam **públicos**. O formulário não tem dados sensíveis, mas qualquer pessoa com o link consegue abrir.
- O endereço do script fica visível no código da página. O script só aceita respostas com as opções do formulário, mas alguém com o link pode enviar respostas falsas. Se notar algo estranho, confira a planilha.
- A página tem `noindex`, por isso não aparece em buscadores.

## Lendo a planilha

- Cada envio vira uma linha. Nas perguntas de múltipla escolha, as opções vêm separadas por `;`.
- O `codigo` é aleatório e fica guardado no navegador da pessoa. Se ela revisar e enviar de novo, aparece uma linha nova com o **mesmo código**: considere só a mais recente de cada código.
- `minutos` é o tempo entre abrir a página e enviar.

Se alterar o `Code.gs` depois de implantar, vá em **Implantar → Gerenciar implantações → editar → Nova versão** para a mudança valer no mesmo endereço.
