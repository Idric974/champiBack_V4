import RPi.GPIO as gpio
from signal import signal, SIGINT
from sys import exit, argv

def handler(signal_received, frame):
    # Gestion propre du nettoyage en cas d'interruption (SIGINT)
    print('')
    print('SIGINT or CTRL-C detected. Exiting gracefully')
    gpio.cleanup()
    exit(0)

def main(pin):
    # Initialisation des GPIO
    gpio.setmode(gpio.BCM)
    gpio.setup(pin, gpio.OUT)
    
    # Activation du GPIO
    gpio.output(pin, gpio.HIGH)
    print(f"GPIO {pin} is now ON")

if __name__ == '__main__':
    # On prévient Python d'utiliser la méthode handler quand un signal SIGINT est reçu
    signal(SIGINT, handler)
    
    # Vérification de l'argument de la ligne de commande
    if len(argv) != 2:
        print("Usage: python script.py <GPIO_PIN>")
        exit(1)
    
    # Récupération du numéro de pin depuis les arguments
    pin = int(argv[1])
    
    # Appel de la fonction main avec le numéro de pin
    main(pin)
