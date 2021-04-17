const logging = module.exports = {}

const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

const kafka = require('kafka-node');
const Producer = kafka.Producer;
const KeyedMessage = kafka.KeyedMessage;
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST });
const producer = new Producer(client);
let km = new KeyedMessage('key', 'msg');

logging.writelog = (ip, info, action, data) => {

    const payloads = [
        {
            topic: 'blog.soga.ng',
            messages: JSON.stringify({
                ip,
                action,
                data,
                info,
                time_raw: Date.now(),
                time: new Date().toLocaleString()
            }),
            key: "",
            timestamp: Date.now()
        }
    ]

    if(producer.ready) {
        console.log('producer.on: ready')
        producer.send(payloads, (err, data) => {
            if (err)
                console.log(err)
            else
                console.log(data);
        })
    }

    producer.on('error', function (err) {
        console.log('producer.on: error')
        console.log(err)
    })
    
}
