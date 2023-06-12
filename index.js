const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkUrl = (request, response, next) => {
    const method = request.method
    const url = request.url
    console.log(`${method}, ${url}`)

    next()
}


app.post('/orders', checkUrl, (request, response) => {
    const { order, clientName, price } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em Preparação" }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})


app.get('/orders', checkUrl, (request, response) => {
   
    return response.json(orders)
})

app.put('/orders/:id', checkOrderId, checkUrl, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updatedOrder = { id, order, clientName, price }

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})


app.delete('/orders/:id', checkOrderId, checkUrl, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/orders,:id', checkOrderId, checkUrl, (request, response) => {
    const index = request.orderIndex
    const newOrder = orders[index]
    
    return response.json(newOrder)
})


app.patch('/orders,:id', checkOrderId, checkUrl, (request, response) => {
    const index = request.orderIndex
    const newOrder = orders[index]

    newOrder.status = "Pedido Pronto"
    
    return response.json(newOrder)
})

app.listen(port, () => {
    console.log(`🏈 Server start on port ${3000}`)
})