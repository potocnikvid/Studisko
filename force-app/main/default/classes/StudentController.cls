public with sharing class StudentController {

    @AuraEnabled(cacheable=true)
    public static List<Student__c> getStudenti() {
        return [
            SELECT Name, Ime__c, Priimek__c, EMSO__c, Tip_studija__c
            FROM Student__c
            WHERE Ime__c != NULL
            LIMIT 1000
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Izpitni_rok__c> getIzpitniRoki() {
        return [
            SELECT Datum__c, Predmet__r.Name
            FROM Izpitni_rok__c
            LIMIT 1000
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Predmet__c> getPredmeti() {
        return [
            SELECT Name
            FROM Predmet__c
            LIMIT 1000
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Opravljanje_izpita__c> getStudentiNaIzpitnemRoku(String izpitniRokId) {
        return [
            SELECT Student__r.Name, Student__r.Ime__c, Student__r.Priimek__c, Student__r.EMSO__c, Student__r.Tip_studija__c
            FROM Opravljanje_izpita__c
            WHERE Izpitni_rok__r.Id =: izpitniRokId
            LIMIT 1000
        ];
    }
}
