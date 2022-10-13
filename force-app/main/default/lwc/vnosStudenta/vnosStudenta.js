import { LightningElement } from 'lwc';

export default class VnosStudenta extends LightningElement {
    showPlacnik = false;
    value = 'redni';
    ime = ''
    priimek = ''
    emso = ''
    get options() {
        return [
            { label: 'Redni', value: 'redni' },
            { label: 'Izredni', value: 'izredni' },
        ];
    }

    checkEmso(e) {
        console.log(e)
        fetch('https://app.agilcon.com/job/emso.php?emso=' + e)
        .then(response => {
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log(data);
            if(data.message == 'OK'){
                return true;
            }
        });
        return false;
    }

    checkEmsoCompute(e) {
        if(e.length == 13){
            var vsota = 0;
            for(var i = 0; i < 12; i++){
                vsota += e[i] * (i + 1);
            }
            var kontrolna = 11 - (vsota % 11);
            if(kontrolna == 10){
                kontrolna = 0;
            }
            if(kontrolna == 11){
                kontrolna = 1;
            }
            if(kontrolna == e[12]){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    handleChange(event) {
        this.value = event.detail.value;
        if(this.value == 'izredni'){
            this.showPlacnik = true;
        } else {
            this.showPlacnik = false;
        }
    }
    handleImeChange(event) {
        this.ime = event.target.value;
    }
    handlePriimekChange(event) {
        this.priimek = event.target.value;
    }
    handleEmsoChange(event) {
        this.emso = event.target.value;
    }

    handleSave() {
        console.log('Ime: ' + this.ime);
        console.log('Priimek: ' + this.priimek);
        console.log('EMŠO: ' + this.emso);
        if(this.checkEmso(this.emso)){
            console.log('EMŠO je pravilen');
        } else {
            console.log('EMŠO je nepravilen');
        }
    }


}