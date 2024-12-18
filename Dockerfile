# Use uma imagem base que já tenha o Bun instalado
FROM oven/bun:latest AS deps

# Define o diretório de trabalho
WORKDIR /app

# Copie o package.json e o bun.lockb (se existir)
COPY package.json bun.lockb* ./

# Instala as dependências
RUN bun install

FROM oven/bun:latest AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia as dependências e arquivos de configuração
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build da aplicação
RUN bun run build

FROM oven/bun:latest AS runner

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários para a execução
COPY --from=builder /app/next.config.mjs ./  
COPY --from=builder /app/.next ./.next       
COPY --from=builder /app/node_modules ./node_modules  

# Expor a porta que o Next.js irá rodar
EXPOSE 3000

# Comando para rodar a aplicação em modo produção
CMD ["bun", "run", "start"]
