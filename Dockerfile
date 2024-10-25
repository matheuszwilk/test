# Use uma imagem base que já tenha o Bun instalado
FROM oven/bun:latest

# Define o diretório de trabalho
WORKDIR /app

# Copie o package.json e o bun.lockb (se existir)
COPY package.json bun.lockb* ./

# Instale as dependências
RUN bun install

# Copie o restante dos arquivos do projeto
COPY . .

# Compile a aplicação para produção
# RUN bun run build

# Exponha a porta que o Next.js usará
EXPOSE 3000

# Defina a variável de ambiente
ENV DATABASE_URL=postgres://postgres:bh2ksv5y@10.193.236.56:5432/serverdb

# Comando para rodar a aplicação
# CMD ["bun", "run", "start"]

# Comando para rodar a aplicação
CMD ["bun", "run", "dev"]
