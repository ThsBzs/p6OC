import Perso from './perso.js';
import Arme from './arme.js';
import Board from './board.js';
import Occuped from './occuped.js';

//******************DECLARATION DES VARIABLES*******************************
//Préparation des persos et armes
const arrayUp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],//Bordure haute
      arrayLeft = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],//Bordure gauche
      arrayDown = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99],//Bordure basse
      arrayRight = [9,19, 29, 39, 49, 59, 69, 79, 89, 99];//Bordure droite
let tour = 0,//Permet de choisir le joueur dont c'est le tour
    moves = 0,
    inFight = false,//permet de bloquer les touches si on entre en phase de combat
    dir;//Récupèrera la touche pressée au clavier

//Création des personnages
const perso1 = new Perso("", 100, 10, "Aucune", 0, "images/minionSmall.png", "", "P1", false, "", "", false, true);
const perso2 = new Perso("", 100, 10, "Aucune", 0, "images/lapinSmall.png", "", "P2", false, "", "", false, true);
//Création des armes
const w1 = new Arme("Epée", 20, "images/epeeSmall.png" , "", "W1");
const w2 = new Arme("Hache", 30, "images/hacheSmall.png" , "", "W2");
const w3 = new Arme("Lance", 25, "images/lanceSmall.png" , "", "W3");
const w4 = new Arme("Fléau", 25, "images/fleauSmall.png" , "", "W4");
//Création des blocs occupés
let occupe = new Occuped("images/grisSmall.jpg", "occuped");

//*******************************************FONCTIONS DE RAFRAICHISSEMENT DES INFOS HTML*************************************
//Animation d'apparition/disparition de la modale de combat
function victory(){
    $('#reload').hide();
    $('#fightRing, .title').hide().fadeOut();
}
//Fonctions d'affichage en HTML des caractéristiques des personnages, utilisée pour mettre à jour ces infos durant le jeu
function refresh(){
    function refreshP1(){
        $('#setP1, #setP1Box').empty()
            .append($('<li>Santé : ' + perso1.hp + '</li>'))
                .append($('<li>Dégâts : ' + perso1.degats + '</li>'))
                    .append($('<li>Arme : ' + perso1.arme + '</li>'))
                        .append($('<li>Score : ' + perso1.score + '</li>'));
        if (perso1.hasWeapon == true){
            $('#weaponP1, #weaponP1Box').empty()
                .append($('<img src="' + perso1.weaponAvatar + '"/>'));
        } else {
            $('#weaponP1, #weaponP1Box').empty();
        };
        //Fonction de vérification de la vie des joueurs pour les conditions de victoire
        if(perso1.alive == false){
            victory();
            $('.victoryP2').fadeIn();
            $('#reload').fadeIn();
        };
    };
        
    function refreshP2(){
        $('#setP2, #setP2Box').empty()
            .append($('<li>Santé : ' + perso2.hp + '</li>'))
                .append($('<li>Dégâts : ' + perso2.degats + '</li>'))
                       .append($('<li>Arme : ' + perso2.arme + '</li>'))
                        .append($('<li>Score : ' + perso2.score + '</li>'));
        if (perso2.hasWeapon == true){
            $('#weaponP2, #weaponP2Box').empty()
                .append($('<img src="' + perso2.weaponAvatar + '"/>'));
        } else {
            $('#weaponP2, #weaponP2Box').empty();
        };
        //Essai d'animation plus propre
        if (perso2.alive == false){
            victory();
            $('.victoryP1').fadeIn();
            $('#reload').fadeIn();
        };
    };
    refreshP1();
    refreshP2();
};

//*******************************************FONCTIONS UTILISEES POUR LES DEPLACEMENTS****************************************
//Ajout de l'image
function addImage(position, avatar, classe){
    $("td").eq(position).css({"background-image": 'url("' + avatar + '")', "background-repeat": "no-repeat", "background-position": "center center"}).removeClass("free").addClass(classe);
};
//Vérification de l'ajout ou non d'une arme 
function checkPos(player){//Appelle addWeapon sur toutes les armes à chaque déplacement. 
    player.addWeapon(w1, "W1");
    player.addWeapon(w2, "W2");
    player.addWeapon(w3, "W3");
    player.addWeapon(w4, "W4");
    refresh();
};
//Mise à jour du tableau des positions, appelé à chaque tour pour récupérer correctement les positions dans le déplacement
function refreshPos(){
    let tableau = Array.from(document.querySelectorAll("td"));
    //Cette fonction renvoie la position de l'élément passé en paramètre.
    function position(elt){//elt est la classe correspondante au perso ou arme concerné
        let resultPosition = tableau.indexOf(document.querySelector(elt)); 
        return resultPosition;
    };
    //Appel de la fonction sur chaque élément 
    perso1.position = position(".P1");
    perso2.position = position(".P2");
    w1.position = position(".W1");
    w2.position = position(".W2");
    w3.position = position(".W3");
    w4.position = position(".W4");
    //Ce if évite que la fonction checkPos ne soit appelée sans nécessité sur un joueur immobile.
    if(p1Play == true){
        checkPos(perso1);
    } else {
        checkPos(perso2);
    };
};   

//************************ AJOUT DES NOMS DES PERSONNAGES EN HTML*****************************
//Joueur1
$('#form1').submit(function(e){
    let saisie1 = form1.elements.nom1;
    $($('<h3>Nom : ' + saisie1.value + '</h3>')).insertAfter('#img1, #img1Box');
    refresh();
    $('#form1').hide();
    e.preventDefault();
});

//Joueur2
$('#form2').submit(function(e){
    let saisie2 = form2.elements.nom2;
    $($('<h3>Nom : ' + saisie2.value + '</h3>')).insertAfter('#img2, #img2Box');
    refresh();
    $('#form2').hide();
    e.preventDefault();
});

//********************************************GENERATION DU PLATEAU**********************************************************
//Action au clic sur "Lancer !"
$('#place, #reload').click(function(e){
    tour = 0;//remise à 0 du nombre de tours
    moves = 0;//Idem avec les mouvements
    $('.stopP1, .stopP2').empty();//Animations HTML : masquage des boutons de fin de tour
    $('#masque, #reload').hide();//Masquage de la fenêtre modale
    $("td, tr, table").remove();//Suppression du plateau de jeu
    $('#explain, #showFightRing, .title').show();//Rechargement des éléments dans la fenêtre modale
    $('#rulesBox').fadeOut();//Disparition de la modale
    perso1.newRound(perso1);//Réinitialisation des points de vie et armes
    perso2.newRound(perso2);
    refresh();//Réinitialisation des éléments HTML correspondants
    inFight = false;//Réinitialisation du booléen de combat
    $('#reload, .victoryP1, .victoryP2').hide();//Masquage du bouton de nouvelle partie
    $('#fightRing').show();////Afichage dans la modale de la partie combat
    $('#battlefield').append($('<table>') //Création du plateau
        .attr('id', 'playBoard1'));
    const board1 = new Board(9, 9);
    const lines = board1.lines;
    const cases = board1.cases;
    for (let i=0; i<=lines; i++){//Ajout des lignes
        $('table').append($('<tr>'));
    };
    $('tr').each(function(){
        for (let i=0; i<=cases; i++){//Ajout sur chaque case de la classe free
            $(this).append($('<td class="free">'));
        };
    });
//*******************************PLACEMENT DES ELEMENTS SUR LE PLATEAU*********************************************************
    //Lancement du positionnement de tous les éléments (cases occupées, armes et persos)
    let free = document.querySelectorAll(".free");//Renvoie un array de toutes les cases .free
    function melt (){
        return (Math.floor(Math.random()*free.length));//Renvoie une valeur au hasard dans le tableau
    };
    let arr = [];//Création d'un array pour stocker les valeurs renvoyées par la fonction melt
    
    function aGriserEstElleOk(value1, value2){//Vérifie que les valeurs passées en paramètres ne se touchent pas
        let arrToCheck = [value2 -11,  value2 -10,  value2 -9,  value2 -1, value2, value2 +1,  value2 +9,  value2 +10,  value2 +11];
        if (arrToCheck.includes(value1)) {//Si value1 est rencontrée dans le tableau comparatif
            return false;//Blocage de value1
        }
        return true;//Sinon, on envoie value 1.
    };  
    //Application de cette fonction sur toutes les valeurs du tableau
    let i = 0;
    while (i < 16) {
        let aGriser = melt();//On récupère une valeur
        let j = 0;
        while ( j < arr.length ){//Tant que j ne vaut pas la taille du tableau
            if(aGriserEstElleOk(aGriser, arr[j]) == true){//On compare la nouvelle valeur avec sa précédente dans le tableau
                j ++;//Si c'est OK, on augmente j pour passer à l'index suivant 
            } else { 
                break;
            };   
        };
        if (j == arr.length){//Si j est équivalent à la taille du tableau
            arr.push(aGriser);//On y intègre la nouvelle valeur
            i++;//On incrémente i.
        }
    };

    let arrIndex = 0;//arr[arrIndex] permet de faire correspondre l'index du plateau (arr) avec la valeur d'une boucle de 16 tours utilisée ensuite (arrIndex)
    for(i=0; i < 16; i++){
        if (arrIndex < 10){//Fera donc 10 tours en changeant le css en grey
            addImage(arr[arrIndex], occupe.avatar, occupe.classe);
            arrIndex ++;//On augmente la valeur d'arrIndex à chaque fois, pour ne pas repasser sur la même case
        } else if (arrIndex > 9 && arrIndex < 16 ){//Switch sur les index concernés pour attribuer une arme différente à chaque fois, puis les persos
            switch(arrIndex){
                case 10:
                    addImage(arr[arrIndex], w1.avatar, w1.classe);
                    arrIndex++;
                    break;
                case 11 :
                    addImage(arr[arrIndex], w2.avatar, w2.classe);
                    arrIndex++;
                    break;
                case 12:
                    addImage(arr[arrIndex], w3.avatar, w3.classe);
                    arrIndex++;
                    break;
                case 13 :
                    addImage(arr[arrIndex], w4.avatar, w4.classe);
                    arrIndex++;
                    break;
                case 14 :
                    addImage(arr[arrIndex], perso1.avatar, perso1.classe);
                    arrIndex ++;
                    break;
                case 15 :
                    addImage(arr[arrIndex], perso2.avatar, perso2.classe);
                default:
                    arrIndex ++;
            };
        } 
    };
    refreshPos();//Permet de définir les positions des deux joueurs en fonction des cases ayant les classes .P1 et .P2
    possible(perso1.position);//Permet de lancer la fonction possible dès le début du jeu pour le perso1
});//Ne pas retirer, fin de la fonction de création du plateau
    
//**************************************DEPLACEMENT + INDICATION DES CASES POSSIBLES***********************************
//Fonction de coloration des cases de déplacement possible
function possible(position){
    function checkNext(position){//permet l'ajout de la classe possible
        if((!$('td').eq(position).hasClass("occuped"))){//Si la case concernée n'est pas grisée, on lui ajoute la classe "possible".
        $('td').eq(position).addClass("possible");
        };
    };
    $('td').removeClass("possible");//On retire toutes les cases colorées
    function checkPossible(array, pos1, pos2, pos3){//On ajoute la classe possible au fur et à mesure
        if((array.indexOf(position) == -1) && (moves < 3)){//Si la position du joueur n'est pas une bordure et si les mouvements sont à 0
            checkNext(position + pos1);//On envoie sur la case suivante la classe possible.
            if (!$('td').eq(position + pos1).hasClass("occuped") && (array.indexOf(position + pos1) == -1) && (moves < 2)){//Même opération avec les cases suivantes, en modifiant les valeurs
                checkNext(position + pos2);
                if (!$('td').eq(position + pos2).hasClass("occuped") && (array.indexOf(position + pos2) == -1) && (moves < 1)){
                    checkNext(position + pos3);
                };
            };
        };
    };
    checkPossible(arrayDown, +10, +20, +30);//Ajout - ou non - de possible sur les cases autour du joueur
    checkPossible(arrayUp, -10, -20, -30);
    checkPossible(arrayLeft, -1, -2, -3);
    checkPossible(arrayRight, +1, +2, +3);
};
function checkFight(value1, value2){
            let arrFight = [value2 + 10, value2-10, value2+1, value2-1];//Préparation d'un tableau des cases proches
            if (arrFight.includes(value1)//Si la position du perso est dans ce tableau
            ){
                inFight = true;//Permet de bloquer les déplacements lors d'un combat
                $('#masque').fadeIn();
                $('#fightRing').hide();
            }
            return inFight;
        };
//Fonction appelée par l'appui sur "tour suivant".
function stopPlay(perso){
    moves = 0;//On remet les mouvements à 0
    tour++;//On incrémente les tours
    $('.stopP1, .stopP2').empty();//On masque les boutons de passage au tour suivant
    possible(perso.position);//On affiche les cases possibles pour le joueur suivant
};

let p1Play;//Création d'un booleen pour définir la priorité en combat
//Fonction de déplacement
$(document).keydown(function(e){
    if (inFight == false){//Si on n'est pas en combat
        let dir = e.which;//On récupère la valeur de la touche saisie
        if (dir == 37 || dir == 38 || dir == 39 || dir == 40){//Evite que la saisie du nom ne soit prise en compte pour la fonction possible()
            if (tour%2 == 0){//Si tour est pair, joueur1 joue
                p1Play = true;//Joueur1 aura la priorité en combat
                possible(perso1.position);//On ajoute les cases possibles
                if( moves < 4){
                    $('.stopP1, .stopP2').empty();//Evite que les boutons ne s'accumulent à chaque appui sur une touche.On vide les containers à chaque appui.
                    $('.stopP1').append($('<br/><input type="button" value="Fin du tour" id="buttonStopP1" action="#">'));//Ajout du bouton de fin de tour
                    perso1.move(perso1, dir);//Appel du déplacement du joueur
                    refreshPos();
                    checkFight(perso1.position, perso2.position);
                    moves ++;
                    possible(perso1.position);//Ajout des nouvelles cases possibles
                    $('#buttonStopP1').click(function(e){//Gestion du clic sur stop
                        stopPlay(perso2);
                    });
                };
            } else {
                p1Play = false;//Quand false, joueur2 a la priorité au combat.
                possible(perso2.position);
                if( moves < 4){
                    $('.stopP1, .stopP2').empty();
                    $('.stopP2').append($('<br/><input type="button" value="Fin du tour" id="buttonStopP2" action="#">'));
                    perso2.move(perso2, dir);
                    refreshPos();
                    checkFight(perso1.position, perso2.position);
                    moves ++;
                    possible(perso2.position);
                    $('#buttonStopP2').click(function(e){
                        stopPlay(perso1);
                    });
                }
            }
            if(moves == 3){//Ajout des animations lorsque moves vaut 3. Permet d'afficher précisément les cases possibles et le bouton stop au moment du passage au prochain tour.
                tour ++;//Par contre, quand c'est le cas, on incrémente tour
                moves = 0;//Et on remet moves à 0 pour le prochain tour
                if (tour%2 == 0){
                    possible(perso1.position);
                   $('.stopP2').empty();
                } else {
                    possible(perso2.position);
                    $('.stopP1').empty();
                }
            }; 
        };
    };
});

//************************************************GESTION DES COMBATS **************************************************
//Désactivation des boutons de combat au tour par tour
function disableP1(){//Appelée en fin de tour de combat
    $('.attackP1, .defendP1').hide();//Masque les boutons pour joueur1
    $('.attackP2, .defendP2').show();//Affiche ceux du joueur2
};

function disableP2(){
    $('.attackP2, .defendP2').hide();
    $('.attackP1, .defendP1').show();
};
// Lancement du combat au clic sur "on y va"
$('#showFightRing').click(function(e){
    $('#explain, #showFightRing').hide();//On cache les explications et le bouton de lancement de combat
    $('#fightRing').fadeIn();//Apparition des éléments de combat
    if(p1Play == true){//Si joueur1 jouait, il commence
        disableP2();//on masque les éléments du joueur2
    } else if (p1Play == false){//Sinon, c'est joueur qui commence
        disableP1();
    };
});
    
//Ecoute des boutons P1
$('.attackP1').click(function(e){
    p1Play = false;//Permet l'affichage ou non des boutons de combat
    perso1.attaque(perso1, perso2);//Attaque
    refresh();
    disableP1();//On masque joueur1
});
$('.defendP1').click(function(e){
    p1Play = false;
    disableP1();
    perso1.hasShield = true;//Activation du bouclier pour le prochain coup
});
//Ecoute des boutons P2
$('.attackP2').click(function(e){
    p1Play = true;
    perso2.attaque(perso2, perso1);
    refresh();
    disableP2();
});
$('.defendP2').click(function(e){
    disableP2();
    p1Play = true;
    perso2.hasShield = true;
});