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
    occupe,
    free,//Tableau pour le positionnement. Est utilisé pour les déplacements
//Préparation du tableau
    aGriser,//Correspond aux cases occupées, sera défini dans la fonction d'occupation du tableau
    result,//Correspond aux index renvoyés par la fonction aleatoire pour le placement des persos
    tableau,//Correspond au tableau global, mis à jour pour les positions
//Préparation des déplacements
    arrayPos = [],
    arrayUp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],//Bordure haute
    arrayLeft = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],//Bordure gauche
    arrayDown = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99],//Bordure basse
    arrayRight = [9,19, 29, 39, 49, 59, 69, 79, 89, 99],//Bordure droite
    tour = 0,//Permet de choisir le joueur dont c'est le tour
    //arrayPos = [0, 1, 2, 3, 4, 5],//Tableau des positions des éléments déplaçables - SUPPRIMABLE SI REFRESHPOS RESTE EN objet.position
    dir;//Sera utilisée dans la méthode pour définir la touche pressée
/*  posP1,//positions
    posP2,
    posW1,
    posW2,
    posW3,
    posW4;*/

//*****************DECLARATION DES OBJETS, CLASSES ET METHODES******************
//Création d'une classe personnage
class Perso {
    //Constructeur
    constructor(nom, hp, degats, arme, score, avatar, position, classe, defense){
        this.nom = nom;
        this.hp = hp;
        this.degats = degats;
        this.arme = arme;
        this.score = score;
        this.avatar = avatar;
        this.position = position;
        this.classe = classe;
        this.defense = defense;
    }
    //Méthode de récupération d'arme
    /*weapon(nom, degats){
        if(this.position == Arme.position)
        this.arme = Arme.nom;
        this.degats += Arme.degats;
        console.log("Arme récupérée");
        //Attention, où rajouter les dégâts de l'arme à ceux du perso???
    }*/
    //Méthode d'attaque
    attaque(attaquant, cible){//Ajouter une vérification de la santé de l'adversaire
        if(attaquant.hp > 0 && cible.hp > 0){
            let degatsMax = perso.degats + Arme.degats;
            cible.hp = cible.hp - (attaquant.degatsMax - cible.defense);
        };
    };

    //Méthode de déplacement n'utilisant pas de paramètre 
    move(){ 
        /*function moveUp(value){
            remove(Perso.position, Perso.classe);//Retire l'image avec la fonction remove()
                Perso.position += value;//Met à jour la position en lui donnant en valeur celle passée en paramètre +1
                addImage(Perso.position, Perso.avatar, Perso.classe);// Devrait théoriquement ajouter, via la fonction addImage2(), le CSS.//Met à jour le tableau des positions. Ne fonctionne pas correctement ici. 
                refreshPos();
        };
        function moveDown(value){
            remove(Perso.position, Perso.classe);//Retire l'image avec la fonction remove()
                Perso.position -= value;//Met à jour la position en lui donnant en valeur celle passée en paramètre +1
                addImage(Perso.position, Perso.avatar, Perso.classe);// Devrait théoriquement ajouter, via la fonction addImage2(), le CSS.//Met à jour le tableau des positions. Ne fonctionne pas correctement ici. 
                refreshPos();
        };*/
        switch(dir){
            case 39 : //Droite
                //moveUp(1);
                //Vérifications avant déplacement : si la future case n'est pas grisée, et si on n'est pas sur une bordure
                if ((!$('td').eq(this.position + 1).hasClass("occuped")) && (arrayRight.indexOf(this.position) == -1)){
                    remove(this.position, this.classe);//Retire l'image avec la fonction remove()
                    this.position += 1;//Met à jour la position en lui donnant en valeur celle passée en paramètre +1
                    addImage(this.position, this.avatar, this.classe);// Devrait théoriquement ajouter, via la fonction addImage2(), le CSS.//Met à jour le tableau des positions. Ne fonctionne pas correctement ici. 
                    refreshPos();
                };
                break;
            case 37 ://Gauche
                //moveDown(1);
                if ((!$('td').eq(this.position - 1).hasClass("occuped")) && (arrayLeft.indexOf(this.position) == -1)){
                    remove(this.position, this.classe);
                    this.position -= 1;
                    addImage(this.position, this.avatar, this.classe);
                    refreshPos();
                };
            break;
            case 38 ://Haut
                //moveDown(10);
                if ((!$('td').eq(this.position - 10).hasClass("occuped")) && (arrayUp.indexOf(this.position) == -1)){
                    remove(this.position, this.classe);
                    this.position -= 10;
                    addImage(this.position, this.avatar, this.classe);
                    refreshPos();
                };
            break;
            case 40 ://Bas
                //moveUp(10);
                if ((!$('td').eq(this.position + 10).hasClass("occuped")) && (arrayDown.indexOf(this.position) == -1)){
                    remove(this.position, this.classe);
                    this.position += 10;
                    addImage(this.position, this.avatar, this.classe);
                    refreshPos();
                };
            break;
            default:
                refreshPos();
        }   
    };
};

//Création d'une classe arme
class Arme {
    //Constructeur
    constructor(nom, degats, avatar, position, classe){
        this.nom = nom;
        this.degats = degats;
        this.avatar = avatar;
        this.position = position;
        this.classe = classe;
    }
};

    
//Création d'une classe de bloc occupé
class Occuped{
    //Constructeur
    constructor(avatar, classe, position){
        this.avatar = avatar;
        this.classe = classe;
        this.position = position;
    }
};
    
//Création d'une classe pour le tableau
class Board{
    //Constructeur
    constructor(lines, cases){
    this.lines = lines;
    this.cases = cases;
    }
};

//**********************************PREPARATION DES FONCTIONS UTILISEES POUR LES DEPLACEMENTS****************************************
//Fonction de suppression du css pour retirer l'image
function remove(position, classe){
    $("td").eq(position).css("background-image", "none").removeClass(classe).addClass("free");
};
//Ajout de l'image
function addImage(position, avatar, classe){
    let result = $("td").eq(position).css({"background-image": 'url("' + avatar + '")', "background-repeat": "no-repeat", "background-position": "center center"}).removeClass("free").addClass(classe);
    return result;
};

//Cette version ne fonctionne pas, elle ne parvient pas à atteindre les valeurs demandées. Voir pourquoi.
/*function checkWeapon(){
    if(Perso.position == Arme.position){
        Perso.arme = Arme.nom;
        Perso.degats += Arme.degats;
        console.log("Arme P1 = " + perso1.arme);
        console.log("Arme P2 = " + perso2.arme);
        console.log("Perso.position = " + Perso.position);

    }
}*/
function refreshPos(){
    //Mise à jour du tableau avec les nouvelles positions
    arrayPos = [] ;
    tableau = [];
    tableau = Array.from(document.querySelectorAll("td"));
    //Cette fonction renvoie la position de l'élément passé en paramètre.
    function position(elt){//elt est la classe correspondante au perso concerné
        let result = tableau.indexOf(document.querySelector(elt)); 
        return result;
    };
    perso1.position = position(".P1");
    perso2.position = position(".P2");
    w1.position = position(".W1");
    w2.position = position(".W2");
    w3.position = position(".W3");
    w4.position = position(".W4");
    arrayPos = [perso1.position, perso2.position, w1.position, w3.position, w4.position];
    //console.log("ArrayPos : " + arrayPos);
    checkPos(perso1);
    checkPos(perso2);
    return arrayPos;//ArrayPos est le tableau des positions, permet de travailler ensuite sur toutes les positions
};   
//Fonction de récupération d'arme
function checkPos(player){
    if(player.position == w1.position){
        player.degats = 10;
        player.arme = w1.nom;
        player.degats += w1.degats;
    } else if (player.position == w2.position){
        player.degats = 10;
        player.arme = w2.nom;
        player.degats += w2.degats;
    } else if (player.position == w3.position){
        player.degats = 10;
        player.arme = w3.nom;
        player.degats += w3.degats;
    } else if (player.position == w4.position){
        player.degats = 10;
        player.arme = w4.nom;
        player.degats += w4.degats;
    };
    refreshP1();
    refreshP2();
};

//Fonctions d'affichage en HTML des caractéristiques des personnages, utilisée pour mettre à jour ces infos durant le jeu
function refreshP1(){
        $('#setP1').empty();
        $('#setP1').append($('<li>Santé : ' + perso1.hp + '</li>'))
        .append($('<li>Dégâts : ' + perso1.degats + '</li>'))
            .append($('<li>Arme : ' + perso1.arme + '</li>'))
                .append($('<li>Score : ' + perso1.score + '</li>'));
    };
function refreshP2(){
        $('#setP2').empty();
        $('#setP2').append($('<li>Santé : ' + perso2.hp + '</li>'))
        .append($('<li>Dégâts : ' + perso2.degats + '</li>'))
            .append($('<li>Arme : ' + perso2.arme + '</li>'))
                .append($('<li>Score : ' + perso2.score + '</li>'));
    };
    
    
//Création des personnages
perso1 = new Perso("", 100, 10, "Aucune", 0, "images/minionSmall.png", arrayPos[0], "P1", 50);
perso2 = new Perso("", 100, 10, "Aucune", 0, "images/lapinSmall.jpg", arrayPos[1], "P2", 50);
//Création des armes
w1 = new Arme("Epée", 20, "images/epeeSmall.jpg" , arrayPos[2], "W1");
w2 = new Arme("Hache", 30, "images/hacheSmall.jpg" , arrayPos[3], "W2");
w3 = new Arme("Lance", 25, "images/lanceSmall.jpg" , arrayPos[4], "W3");
w4 = new Arme("Fléau", 25, "images/fleauSmall.jpg" , arrayPos[5], "W4");
//Création des blocs occupés
occupe = new Occuped("images/grisSmall.jpg", "occuped");


   

//************************ AJOUT DES CARACTERISTIQUES DES PERSONNAGES EN HTML*****************************
//Joueur1
p1.addEventListener("submit", function(e){
    let saisie1 = form1.elements.nom1;
    $('<h3>Nom : ' + saisie1.value + '</h3>').insertAfter('#img1');
    refreshP1();
    $('#form1').hide();
    e.preventDefault();
});
   
//Joueur2
p2.addEventListener("submit", function(e){
    let saisie2 = form2.elements.nom2;
    $('<h3>Nom : ' + saisie2.value + '</h3>').insertAfter('#img2');
    refreshP2();
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
    //Fonction de vérification de 2 valeurs avant ajout dans le tableau
    //Est utilsée pour le P2, afin d'éviter une apparition collée au P1
    function check(value1, value2){
	   if (!arr.includes(value1) && 
           !arr.includes(value2) && 
           value1 != value2 && 
           value1 != value2 -11 && 
           value1 != value2 -10 && 
           value1 != value2 -9 && 
           value1 != value2 -1 && 
           value1 != value2 +1 && 
           value1 != value2 +9 && 
           value1 != value2 +10 && 
           value1 != value2 +11){
           arr.push(value1);
	   };
        return arr;
    };
    //Création d'un array pour stocker les valeurs renvoyées par la fonction melt
    let arr = [];
    //************************MISE EN ATTENTE POUR PASSAGE EN BOUCLE SESSION MENTORAT**************************
/*    //Ajout de 15 valeurs dans le tableau
    while(arr.length<=14){//On limite la taille du tableau 
        melt();
        if(!arr.includes(aGriser)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
            arr.push(aGriser);
        };
    };
    //Ajout du P2 dans le tableau, en vérifiant sa proximité avec P1
     while(arr.length<=15){//On limite la taille du tableau 
         melt();
         if(!arr.includes(aGriser)){//Si la valeur reçue de melt n'est pas déjà dans le tableau, on l'ajoute
             //Si cette valeur n'est pas trop proche de la précédente
             check(aGriser, arr[14]);
             //check insère aGriser si sa valeur passe toutes les vérifications
        }; 
    };*/
    //********************************FIN DE MISE EN ATTENTE******************************

    //Première version d'une boucle pour le placement avec vérification des positions
    //Piste de boucle imbriquée pour la fonction check

i = 1;
 
while (i < 17) {
    melt();
    for (j = 0; j <i; j++){
       // melt();
        check(aGriser, arr[j]);
        //console.log("aGriser = " + aGriser);
        //console.log("arr = " + arr);
    };
    i ++;
};

 /*   
i= 1;
while(i<14){ //Toutes les valeurs de 0 à 15 
	j=0;
	blablabla;
	while(j<i){//Vérifie une valeur avant de l'ajouter dans le tableau
		j++;
	}
	i++;
};*/
       
    //console.log("Arr = " + arr);
    let arrIndex = 0;
    //arr[arrIndex] permet de faire correspondre l'index du plateau (arr) avec la valeur d'une boucle de 16 tours utilisée ensuite (arrIndex)
    for(i=0; i<= 15; i++){
        if (arrIndex<= 9){//Fera donc 10 tours en changeant le css en grey
            addImage(arr[arrIndex], occupe.avatar, occupe.classe);
            arrIndex ++;//On augmente la valeur d'arrIndex à chaque fois, pour ne pas repasser sur la même case
        } else if (arrIndex>9 && arrIndex <= 13){//4 tours avec les armes
            //Switch sur les index concernés pour attribuer une arme différente à chaque fois
            switch(arrIndex){
                case 10:
                    addImage(arr[arrIndex], w1.avatar, w1.classe);
                    arrIndex++;
                break;
                case 11 :
                    addImage(arr[arrIndex], w2.avatar, w2.classe);
                    arrIndex++;
                break;
                case  12:
                    addImage(arr[arrIndex], w3.avatar, w3.classe);
                    arrIndex++;
                break;
                case 13 :
                    addImage(arr[arrIndex], w4.avatar, w4.classe);
                    arrIndex++;
                break;
                default:
                    arrIndex++;             
            };
        } else if (arrIndex == 14) {//1 tour pour le perso1
            addImage(arr[arrIndex], perso1.avatar, perso1.classe);
            arrIndex ++;
        } else if (arrIndex == 15) {//1 dernier tour pour le perso2
            addImage(arr[arrIndex], perso2.avatar, perso2.classe);
        };
    };
    refreshPos();//Permet de définir les positions des deux joueurs en fonciton des cases ayant les classes .P1 et .P2

});//Ne pas retirer, fin de la fonction de création du plateau


    
//********************************DEBUT D'ESSAI DE  DEPLACEMENT***********************************
//Fonction de déplacement provisoire, il faut encore ajouter la prise en compte du nombre de cases.
$(document).keydown(function(e){
    dir = e.which;
    if (tour%2 == 0){
        perso1.move();
        tour ++;
    } else {
        perso2.move();
        tour ++;
    }
});

/*
if (tour%2 == 0){
    $(document).keydown(function(e){
        //refreshPos();
        dir = e.which;
        perso1.move();
        tour ++;
        console.log("Tour = " + tour);
    });
} else if (tour%2 == 1){
   $(document).keydown(function(e){
        //refreshPos();
        dir = e.which;
        perso2.move();
       tour ++;
        console.log("Tour = " + tour);

    });
};

*/


 
});//Ne pas retirer, fin de la fonction de chargement du DOM
