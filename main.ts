
//Activamos el servicio uart ponemos el modulo de radio en el grupo 2

radio.setGroup(0)
serial.redirectToUSB()

//Periodo del PWM
pins.P0.analogWrite(0)
pins.P0.analogSetPeriod(100)

let temp: Number
let brillo: number




//Coprueba la temperatura y activa/ desactiva la calefaccion en caso contrario
loops.everyInterval(1500, function () {
    if (temp < input.temperature() && !pins.P6.digitalRead()) {
        pins.P6.digitalWrite(true)
    } else if (temp >= input.temperature() && pins.P6.digitalRead()) {
        pins.P6.digitalWrite(false)
    }
})






//Leemos los comandos  y los ejeccutamos
radio.onReceivedValue((command , value) => {

    let cmd = command.toUpperCase()

    try {
        switch (cmd) {
            case "LUZ":
                let brillo = value
                pins.P0.analogWrite((brillo))
                basic.showNumber(brillo)
                serial.writeLine(brillo.toString())
                break

            case "LOCK":
                let position = value
                switch (position) {
                    case 1:
                        pins.P5.pulseIn(PulseValue.High, 500)
                        break
                    case 0:
                        pins.P5.digitalWrite(false)
                        break
                }

                break

            case "TEMP":
                temp = value
                break

            default:
                serial.writeLine("Commando erroneo")

        }
    }
    catch (error) {
        serial.writeLine(error)
    }

})
