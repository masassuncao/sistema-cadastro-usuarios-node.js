function connect() {
  return require('amqplib')
    .connect("amqp://localhost")
    .then(conn => conn.createChannel());
}

function createQueue(channel, queue){
  return new Promise((resolve, reject) => {
    try{
      channel.assertQueue(queue, { durable: true });
      resolve(channel);
    }
    catch(err){ reject(err) }
  });
}

function sendToQueue(queue, message){
  connect()
    .then(channel => createQueue(channel, queue))
    .then(channel => {
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
      console.log('Nova mensagem enviada para a fila.')
    })
    .catch(err => console.log(err))
}

function consumeFromQueue(queue, callback){
  connect()
    .then(channel => createQueue(channel, queue))
    .then(channel => {
      channel.consume(queue, callback, { noAck: true })
      console.log('Nova mensagem recebida da fila.')
    })
    .catch(err => console.log(err));
}

module.exports = {
  sendToQueue,
  consumeFromQueue
};