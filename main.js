$(function(){//Attente du chargement complet du DOM avant modification
//******************DECLARATION DES VARIABLES*******************************
//Récupération des noms saisis par le(s) joueur(s)
const p1 = document.querySelector("#form1");  
const p2 = document.querySelector("#form2")
//Préparation des persos et armes
let perso1,
    perso2,
    epee,
    hache,
    lance,
    fleau,
//Préparation du tableau
    aGriser,//Correspond aux cases occupées, sera défini dans la fonction d'occupation du tableau
    result,//Correspond aux index renvoyés par la fonction aleatoire pour le placement des persos
    tableau,//Correspond au tableau global, mis à jour pour les positions
//Préparation des déplacements
    arrayPos,//Tableau des positions des éléments déplaçables - SUPPRIMABLE SI REFRESHPOS RESTE EN objet.position
    dir,//Sera utilisée dans la méthode pour définir la touche pressée
    posP1,//positions
    posP2,
    posW1,
    posW2,
    posW3,
    posW4;


//*****************DECLARATION DES OBJETS, CLASSES ET METHODES******************
//Création d'une classe personnage
class Perso {
    //Constructeur
    constructor(nom, hp, degats, arme, score, avatar, position){
        this.nom = nom;
        this.hp = hp;
        this.degats = degats;
        this.arme = arme;
        this.score = score;
        this.avatar = avatar;
        this.position = position;
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
    /*Définir ici les règles de déplacement, en incluant les exceptions de cases bloquées et un nombre max de cases déplacées, ainsi que la/les directions.
    Ne pas oublier la possibilité qu'une case soit occupée.*/
    $("body").keydown(function(e){
        dir = e.which;
        return dir;
    })
     switch(dir){
            case 39 :
                this.position = this.position ++;
            break;
            case 37 :
                this.position = this.position --;
            break;
            case 38 :
                this.position = this.position - 10;
            break;
            case 40 :
                this.position = this.position + 10;
            break;
        }
    /*let positionA = ;*/
    };
};

//Création d'une classe arme
class Arme {
    //Constructeur
    constructor(nom, degats, avatar, position){
        this.nom = nom;
        this.degats = degats;
        this.avatar = avatar;
        this.position = position;
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
    
//Création des personnages
perso1 = new Perso("", 100, 10, "Aucune", 0, "images/minionSmall.png", "");
perso2 = new Perso("", 100, 10, "Aucune", 0, "images/lapinSmall.jpg", "");
//Création des armes
w1 = new Arme(epee, 20, "images/epeeSmall.jpg" , "");
w2 = new Arme(lance, 30, "images/hacheSmall.jpg" , "");
w3 = new Arme(hache, 25, "images/lanceSmall.jpg" , "");
w4 = new Arme(fleau, 25, "images/fleauSmall.jpg" , "");

   

//************************ GENERATION DES PERSONNAGES*****************************
//Joueur1
p1.addEventListener("submit", function(e){
    let saisie1 = form1.elements.nom1;
        $('<h3>Nom : ' + saisie1.value + '</h3>').insertAfter('#img1');
    $('#setP1').append($('<li>Santé : ' + perso1.hp + '</li>'))
    .append($('<li>Dégâts : ' + perso1.degats + '</li>'))
        .append($('<li>Arme : ' + perso1.arme + '</li>'))
            .append($('<li>Score : ' + perso1.score + '</li>'));
    $('#form1').hide();
    e.preventDefault();
});
   
//Joueur2
p2.addEventListener("submit", function(e){
    let saisie2 = form2.elements.nom2;
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
//Désactivation du bouton, NE PAS RETIRER, il reste visible le temps du développement
    //$('#place').hide();
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
    while(arr.length<=13){//On limite la taille du tableau 
        melt();
        if(!arr.includes(aGriser)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
            arr.push(aGriser);
        };
    };
    
    //Fonction pour les personnages : on attribuera des intervalles permettant de limiter leur placement initial pour éviter qu'ils ne se touchent au départ
    function aleatoire(min, max){
        result = Math.floor(Math.random()* (max-min +1)) + min;
        return result;
    };
    
    /*Fonction pour placer les éléments et classes passés en paramètre
    avatar = objet.avatar
    cat = classe ajoutée*/
    function addImage(avatar, cat){
        let result =  $("td").eq(arr[arrIndex]).append($("<img src = " + avatar + ">")).removeClass("free").addClass(cat);
        return result;
    }
    
    //Rappel de la boucle avec cette nouvelle fonction
    while(arr.length<=14){//On limite la taille du tableau 
        aleatoire(0, 39);
        if(!arr.includes(result)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
            arr.push(result);
        };
    };
     while(arr.length<=15){//On limite la taille du tableau 
        aleatoire(50, 99);
        if(!arr.includes(result)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
            arr.push(result);
        };
    };
    console.log(arr);
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
                    addImage(w1.avatar, "W1");
                    
                    arrIndex++;
                break;
                case 11 :
                    addImage(w2.avatar, "W2");
                    arrIndex++;
                break;
                case  12:
                    addImage(w3.avatar, "W3");
                    arrIndex++;
                break;
                case 13 :
                    addImage(w4.avatar, "W4");
                    arrIndex++;
                break;
                default:
                    arrIndex++;             
            }
        } else if (arrIndex == 14) {//1 tour pour le perso1
            addImage(perso1.avatar, "P1");
            arrIndex ++;
        } else if (arrIndex == 15) {//1 dernier tour pour le perso2
            addImage(perso2.avatar, "P2");
        }
    };
    

/*Pour le moment, cette fonction de récupération des positions reste ici, elle devra être sortie de la génération 
du tableau par la suite, ne garder ici que la fonction refresh pour mettre à jour les positions. Du coup, 
régler les problèmes de scope avant toute chose.*/
//Fonction globale pour mettre à jour les positions de tous les éléments déplacables
function refreshPos(){
    //Mise à jour du tableau avec les nouvelles positions
    tableau = Array.from(document.querySelectorAll("td"));
    //Cette fonction renvoie la position de l'élément passé en paramètre.
    function position(elt){
        let result = tableau.indexOf(document.querySelector(elt)); 
        return result;
    };
    perso1.position = position(".P1");
    perso2.position = position(".P2");
    w1.position = position(".W1");
    w2.position = position(".W2");
    w3.position = position(".W3");
    w4.position = position(".W4");
    /*Ancien essai avec un array. Récupérer la position depuis l'objet me semble en fait plus facile.
    arrayPos = [posP1, posP2, posW1, posW2, posW3, posW4];
    return arrayPos;*/
};

refreshPos();
console.log(perso1.position);
 
});//Ne pas retirer, fin de la fonction de création du plateau
    
//********************************DEBUT D'ESSAI DE PLACEMENT***********************************
//Fonction de suppression du css pour retirer l'image
function remove(classe){
    $("td").eq(classe).css("background-image", "none").removeClass("occuped").addClass("free");
};
    
  
//Fonction de récupération de la touche pressée

//Préparation du déplacement, a revoir dans une méthode plus fonctionnelle à utiliser en POO 
function move (perso){
let choice = "";//A récupérer dans le DOM avec un choix du nombre de cases
let dir = "";//A récupérer avec la touche saisie sur les flèches du clavier
    for (i=0; i<=choice; i++){
        move(player);
        refreshPos();
    }
};

//La même chose en POO, appelle la méthode attribuée au personnage
    perso1.move;
    

    




});//Ne pas retirer, fin de la fonction de chargement du DOM