FROM golang:alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY *.go ./

# RUN go run main.go

CMD ["go", "run", "main.go"]
