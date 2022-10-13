trigger emsoCheck on Student__c (before insert, before update) {
    Student__c students = trigger.new[0];
    Integer e = students.EMSO__c;
    List<Integer> checks = [7,6,5,4,3,2,7,6,5,4,3,2];
    Integer vsota = 0;
    if(length(e) != 13) {
        students.addError('EMŠO ni pravilen');
    }
    for(Integer i = 0; i < length(e) - 1; i++) {
        vsota += checks[i] * e[i];
    }
    Integer control_digit = vsota % 11;
    if(control_digit == 0) {
        control_digit = 0;
    } else {
        control_digit = 11 - control_digit;
    }
    if (control_digit != e[12]) {
        students.addError('EMŠO ni pravilen');
    } 
}