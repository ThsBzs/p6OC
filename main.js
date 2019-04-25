$(function(){//Attente du chargement complet du DOM avant modification
//******************DECLARATION DES VARIABLES*******************************
//Récupération des noms saisis par le(s) joueur(s)
const p1 = document.querySelector("#form1");  
const p2 = document.querySelector("#form2")
//Préparation des persos
let perso1;
let perso2;
//Préparation du tableau
let aGriser;//Correspond aux cases occupées, sera défini dans la fonction d'occupation du tableau
/*let longueur =(free.length - occuped.length);
    console.log(longueur);*/


//*****************DECLARATION DES OBJETS, CLASSES ET METHODES******************
//Création d'une classe personnage
class Perso {
    //Constructeur
    constructor(nom, hp, degats, arme, score, token){
        this.nom = nom;
        this.hp = hp;
        this.degats = degats;
        this.arme = arme;
        this.score = score;
        this.token = token;
    }
    //Méthode de récupération d'arme
    weapon(nom, degats){
        this.nom = arme.nom;
        this.degats = arme.degats;
        //Attention, où rajouter les dégâts de l'arme à ceux du perso???
    }
    //Méthode d'attaque
    attaque(attaquant, cible){
    let degatsMax = perso.degats + arme.degats;
    cible.hp = cible.hp - (attaquant.degatsMax - cible.defense);
    }
    //Méthode de défense
    defense(){
    let degatsMin = coupRecu - 50;
    }
    //Méthode de déplacement
    move(perso){
    /*let positionA = ;*/
    /*Définir ici les règles de déplacement, en incluant les exceptions de cases bloquées et un nombre max de cases déplacées, ainsi que la/les directions.
    Ne pas oublier la possibilité qu'une case soit occupée.*/
    };
};

//Création d'une classe arme
class Arme {
    //Constructeur
    constructor(nom, degats){
        this.nom = nom;
        this.degats = degats;
    }
};
/*Vérifier s'il ne vaut mieux pas créer tout ça en function
Voir aussi pour l'image, à quel endroit la stocker et la déclarer*/

class Board{
    //Constructeur
    constructor(lines, cases){
    this.lines = lines;
    this.cases = cases;
    }
 
};
//Création des armes
/*
const epee = new Arme(epee, 20);
const hache = new Arme(lance, 30);
const lance = new Arme(hache, 25);
const fleau = new Arme(fleau, 25);
*/
   

//************************ GENERATION DES PERSONNAGES*****************************
//Joueur1
p1.addEventListener("submit", function(e){
    let saisie1 = form1.elements.nom1;
    let perso1 = new Perso(saisie1.value, 100, 10, "Aucune", 0, "images/minionSmall.png");
    $('<h3>Nom : ' + saisie1.value + '</h3>').insertAfter('#img1');
    $('#setP1').append($('<li>Santé : ' + perso1.hp + '</li>'))
    .append($('<li>Dégâts : ' + perso1.degats + '</li>'))
        .append($('<li>Arme : ' + perso1.arme + '</li>'))
            .append($('<li>Score : ' + perso1.score + '</li>'));
    $('#form1').hide();
    return perso1;
    e.preventDefault();
});
   
//Joueur2
p2.addEventListener("submit", function(e){
    let saisie2 = form2.elements.nom2;
    let perso2 = new Perso(saisie2.value, 100, 10, "Aucune", 0, "images/lapinSmall.jpg");
    $('<h3>Nom : ' + saisie2.value + '</h3>').insertAfter('#img2');
    $('#setP2').append($('<li>Santé : ' + perso2.hp + '</li>'))
    .append($('<li>Dégâts : ' + perso2.degats + '</li>'))
        .append($('<li>Arme : ' + perso2.arme + '</li>'))
            .append($('<li>Score : ' + perso2.score + '</li>'));
    $('#form2').hide();
    e.preventDefault();
});

   
//************************GENERATION DU PLATEAU***********************************
//Action au clic sur "Lancer !"
$('#place').click(function(e){  
//Avant tout, suppression du contenu s'il existait déjà pour repartir sur un plateau neuf
    $("td, tr, table").remove();
//Première étape : création du plateau
    $('#battlefield').prepend($('<table>')
        .attr('id', 'playBoard1'));
    const board1 = new Board(9, 9);
    const lines = board1.lines;
    const cases = board1.cases;
    for (i=0; i<=lines; i++){
        $('table').append($('<tr>'));
    };
    $('tr').each(function(){
        for (i=0; i<=cases; i++){
            $(this).append($('<td class="free">'));
        };
    });
   
   
//Lancement du positionnement de tous les éléments (cases occupées, armes et persos)
//$("td").css({'background-color': 'white', "background-image": "none"}).removeClass("occuped").addClass("free");//On remet tout en blanc avant de relancer A CONSERVER, servira à réinitialiser le plateau
    let free = document.querySelectorAll(".free");//Renvoie un array de toutes les cases .free
    function melt (){
        aGriser = (Math.floor(Math.random()*free.length));//Renvoie une valeur au hasard dans ce tableau  
        return aGriser;
    };
    //Création d'un array pour stocker les valeurs renvoyées par la fonction melt
    let arr = [];
    while(arr.length<=15){//On limite la taille du tableau 
        melt();
        if(!arr.includes(aGriser)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
            arr.push(aGriser);
        };
    };
    
    //Ensuite, utilisation de ce tableau
    let arrIndex = 0;
    //arr[arrIndex] permet de faire correspondre l'index du plateau (arr) avec la valeur d'une boucle de 16 tours utilisée ensuite (arrIndex)
    for(i=0; i<= 15; i++){
        if (arrIndex<= 9){//Fera donc 10 tours en changeant le css en grey
            $("td").eq(arr[arrIndex]).css("background-color", "grey").removeClass("free").addClass("occuped");
            arrIndex ++;//On augmente la valeur d'arrIndex à chaque fois, pour ne pas repasser sur la même case
        } else if (arrIndex>9 && arrIndex <= 13){//4 tours avec les armes
            //Switch sur les index concernés pour attribuer une arme différente à chaque fois
            switch(arrIndex){
                case 10:
                    $("td").eq(arr[arrIndex]).css({"background-image": "url(images/epeeSmall.jpg)", "background-position": "center", "background-repeat": "no-repeat"}).removeClass("free").addClass("weapon");
                    arrIndex++;
                break;
                case 11 :
                    $("td").eq(arr[arrIndex]).css({"background-image": "url(images/lanceSmall.jpg)", "background-position": "center", "background-repeat": "no-repeat"}).removeClass("free").addClass("weapon");
                    arrIndex++;
                break;
                case  12:
                    $("td").eq(arr[arrIndex]).css({"background-image": "url(images/hacheSmall.jpg)", "background-position": "center", "background-repeat": "no-repeat"}).removeClass("free").addClass("weapon");
                    arrIndex++;
                break;
                case 13 :
                    $("td").eq(arr[arrIndex]).css({"background-image": "url(images/fleauSmall.jpg)", "background-position": "center", "background-repeat": "no-repeat"}).removeClass("free").addClass("weapon");
                    arrIndex++;
                break;
                default:
                    arrIndex++;             
            }
        } else if (arrIndex == 14) {//1 tour pour le perso1
            /*$("td").eq(arr[arrIndex]).append($("<img src = " + perso1.token + ">"));*/
           $("td").eq(arr[arrIndex]).css({"background-image": "url(perso.token)", "background-position": "center", "background-repeat": "no-repeat"}).removeClass("free").addClass("P1");
            arrIndex ++;
        } else if (arrIndex == 15) {//1 dernier tour pour le perso2
            $("td").eq(arr[arrIndex]).css({"background-image": "url(images/lapinSmall.jpg)", "background-position": "center", "background-repeat": "no-repeat"}).removeClass("free").addClass("P2");
        }
    };
    
//Désactivation du bouton, NE PAS RETIRER
    //$('#place').hide();
    
    //********************************DEBUT D'ESSAI DE PLACEMENT**********************************************
//Récupération des positions des joueurs (indexes des cases ayant pour image le token)
/*let positionP1 = $(".P1");//Renvoie un array jQuery, essayer de récupérer l'index de l'élément dans le tableau plutôt
let positionP2 = document.querySelector(".P2");//Renvoie le contenu HTML de l'élément. Pas satisfaisant
let tableau = document.querySelectorAll("td");

console.log(positionP1);
console.log(positionP2);
console.log(tableau.indexOf("td.P1"));*/
});//Ne pas retirer, fin de la fonction de création du plateau

    


});//Ne pas retirer, fin de la fonction de chargement du DOM