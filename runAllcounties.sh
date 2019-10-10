aproach="bandit"

counties=(
    "Esperança"
    "Campina Grande"
    "João Pessoa"
    "Ouro Velho"
    "Arara"
    "Santa Rita"
)

for i in "${counties[@]}"; do
    nohup npm start county="$i" aproach="$aproach" > runLogs/"$i"_"$aproach"_"$(date +%d_%m_%Y_%H_%M_%S_%N)".txt &
done

