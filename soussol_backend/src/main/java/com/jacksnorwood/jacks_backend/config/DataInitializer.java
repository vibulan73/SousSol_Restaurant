package com.jacksnorwood.jacks_backend.config;

import com.jacksnorwood.jacks_backend.entity.*;
import com.jacksnorwood.jacks_backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Seeds the database with Sous Sol restaurant data on first run (dev profile).
 *
 * NOTE: If upgrading from old Jacks Norwood data, clear the menu tables first:
 *   TRUNCATE item_sizes, menu_items, menu_subcategories, menu_categories CASCADE;
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository            userRepository;
    private final MenuCategoryRepository    menuCategoryRepository;
    private final MenuSubcategoryRepository menuSubcategoryRepository;
    private final MenuItemRepository        menuItemRepository;
    private final ItemSizeRepository        itemSizeRepository;
    private final EventRepository           eventRepository;
    private final GalleryRepository         galleryRepository;
    private final SiteSettingsRepository    siteSettingsRepository;
    private final PasswordEncoder           passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        seedAdmin();
        seedMenu();
        seedEvents();
        seedGallery();
        seedSettings();
    }

    // ── Admin ─────────────────────────────────────────────────────────────────
    private void seedAdmin() {
        if (userRepository.count() > 0) return;
        userRepository.save(User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build());
        log.info("Admin seeded: admin / admin123");
    }

    // ── Menu ──────────────────────────────────────────────────────────────────
    private void seedMenu() {
        if (menuItemRepository.count() > 0) return;

        // Clear any leftover category/subcategory data
        menuSubcategoryRepository.deleteAll();
        menuCategoryRepository.deleteAll();

        log.info("Seeding Sous Sol menu...");

        // ── Categories ────────────────────────────────────────────────────────
        MenuCategory mainMenu = saveC("Main Menu", "Starters, mains and sides", 1);
        MenuCategory drinks   = saveC("Drinks",    "Signature cocktails, classics and non-alcoholic", 2);
        MenuCategory wine     = saveC("Wine",      "Sparkling, rosé & orange, blanc and rouge", 3);
        MenuCategory lateNite = saveC("Late Night",  "Late night bites and drinks", 4);

        // ── Main Menu subcategories ───────────────────────────────────────────
        MenuSubcategory premiere = saveS("Première",   mainMenu, 1);
        MenuSubcategory alaCarte = saveS("À la Carte", mainMenu, 2);
        MenuSubcategory sides    = saveS("Sides",      mainMenu, 3);

        // ── Drinks subcategories ──────────────────────────────────────────────
        MenuSubcategory sigCocktails  = saveS("Signature Cocktails", drinks, 1);
        MenuSubcategory ssClassics    = saveS("Sous Sol Classics",   drinks, 2);
        MenuSubcategory nonAlc        = saveS("Non-Alcoholic",       drinks, 3);
        MenuSubcategory bieresCidres  = saveS("Bière & Cidre",       drinks, 4);

        // ── Wine subcategories ────────────────────────────────────────────────
        MenuSubcategory sparkling   = saveS("Sparkling",      wine, 1);
        MenuSubcategory roseOrange  = saveS("Rosé & Orange",  wine, 2);
        MenuSubcategory blanc       = saveS("Blanc",          wine, 3);
        MenuSubcategory rouge       = saveS("Rouge",          wine, 4);

        // ══════════════════════════════════════════════════════════════════════
        // MAIN MENU — Première (Starters)
        // ══════════════════════════════════════════════════════════════════════

        itemSized("Oysters",
                "Mignonette, Lemon, Horseradish, Chumbawamba Sauce",
                mainMenu, premiere, false, false, false,
                new String[][]{{"Six", "19.50"}, {"Douze (12)", "36.00"}});

        item("Bread & Butter",
                "House Baguette, Whipped Garlic Butter",
                "6.00", mainMenu, premiere, false, false, false);

        item("Olives",
                "Smoked, Citrus Marinade",
                "8.00", mainMenu, premiere, false, false, true);

        itemSized("Fromage",
                "House Jam, House Pickles, Crostini",
                mainMenu, premiere, false, false, false,
                new String[][]{{"Saint Paulin", "10.00"}, {"Délice de Bourgogne", "16.00"}, {"Both", "24.00"}});

        item("Salad Normande",
                "Greens, Camembert, Lardons, Walnuts, Citrus Vinaigrette",
                "16.00", mainMenu, premiere, false, false, false);

        item("Cured Arctic Char",
                "Crème Fraîche, Dill, Trout Roe, Crostini",
                "16.00", mainMenu, premiere, false, false, false);

        item("Beetroot Tartare",
                "Horseradish & Coconut Crème, Capers, Shallot, Cornichons, Pickled Mustard Seeds, French Bread",
                "16.00", mainMenu, premiere, false, false, true);

        item("Tartare de Boeuf",
                "Tenderloin, Egg Yolk, Capers, Shallot, Cornichons, Worcestershire, Dijon, French Bread",
                "21.00", mainMenu, premiere, true, false, false);

        item("Roasted Bone Marrow",
                "Smoked Blueberry Honey, Onion Jam, Breadcrumbs, French Bread",
                "19.00", mainMenu, premiere, true, false, false);

        item("Chicken Liver Pâté",
                "Port Stain Gelée, Pistachio, Garlic Confit, Crostini",
                "16.00", mainMenu, premiere, false, false, false);

        item("Boulettes",
                "Meatballs, Caramelized Onion Demi-Glace, Duchess Potato, Gruyère",
                "20.00", mainMenu, premiere, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // MAIN MENU — À la Carte (Mains)
        // ══════════════════════════════════════════════════════════════════════

        item("Seared Duck Breast",
                "Sauce Bigarade, Duck Fat Potatoes, Steamed Kale",
                "36.00", mainMenu, alaCarte, true, false, false);

        item("Filet Mignon",
                "Sauce Bordelaise, Red Wine Poached Mushrooms, Persillade, Beurre à la Truffe",
                "39.00", mainMenu, alaCarte, true, false, false);

        item("Boar Chop Dijonnaise",
                "Braised Cabbage, Apple Chutney, Sauce Dijonnaise",
                "39.00", mainMenu, alaCarte, false, false, false);

        item("Wild Sockeye Salmon",
                "Sauce Ivoire, Sautéed Kale, Trout Roe",
                "34.00", mainMenu, alaCarte, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // MAIN MENU — Sides
        // ══════════════════════════════════════════════════════════════════════

        item("Grilled Carrots",
                "Sauce Gribiche, Smoked Raisins, Almond, Dill Salad",
                "16.00", mainMenu, sides, false, false, true);

        item("Potatoes Dauphinoise",
                "Gruyère, Sauce Soubise, Paprika, Truffle Oil, Dill",
                "15.00", mainMenu, sides, false, false, false);

        item("Roasted Cabbage",
                "Cauliflower Purée, Paprika Oil, Aioli, Bacon Shallot Crumble",
                "14.00", mainMenu, sides, false, false, false);

        item("Parisienne Gnocchi",
                "Forest Mushroom Veloute, Truffle Pistou, Comté Cheese",
                "19.00", mainMenu, sides, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // DRINKS — Signature Cocktails
        // ══════════════════════════════════════════════════════════════════════

        item("Snow Queen",
                "Snap-pea Infused Vodka, White Vermouth, Menthol Bitters · 2¾oz",
                "15.00", drinks, sigCocktails, false, false, false);

        item("Borrealis",
                "Mezcal, Hazelnut Grappa, Birch Syrup, Soy · 2½oz · Contains Nuts",
                "17.00", drinks, sigCocktails, true, false, false);

        item("Campino",
                "Pandan Infused Gin, Blueberry Bitter Bianco, Greek Yoghurt Fat-Washed Vermouth · 3oz",
                "16.00", drinks, sigCocktails, false, false, false);

        item("Banana Beak",
                "Dark Rum, Campari, Banana, Falernum, Lime, Angostura · 2oz",
                "17.00", drinks, sigCocktails, false, false, false);

        item("Beer & a Cigarette",
                "Dry Hopped-Rye, Islay Scotch, Lemon, Barley Macadamia Orgeat, Foamer · 2oz · Contains Nuts",
                "16.00", drinks, sigCocktails, false, false, false);

        item("Aku Aku",
                "Black Tea-Infused Rum, Amaro Montenegro, Charred Peach, Mint, Lime, Black Pepper · 2oz",
                "17.00", drinks, sigCocktails, false, false, false);

        item("Head in the Clouds",
                "White Chocolate Infused Rye, Amaro Nonino, Aperol, Lemon, Hazelnut Vanilla Foam · 2¼oz",
                "16.00", drinks, sigCocktails, false, false, false);

        item("Ube Colada",
                "Coconut Rum, Licor 43, Ube Cream Soda, Coconut Water, Lemon, Peychaud's · 2¼oz",
                "17.00", drinks, sigCocktails, false, false, false);

        item("Hot Date",
                "Tequila Reposado, Aperol, Strawberry Shrub, Dates, Lemon, Thai Chili · 2oz",
                "17.00", drinks, sigCocktails, true, true, false);

        item("Pisco Sour",
                "Pisco, Lemongrass, Ginger, Lemon, Egg White · 2oz",
                "16.00", drinks, sigCocktails, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // DRINKS — Sous Sol Classics
        // ══════════════════════════════════════════════════════════════════════

        item("Sous Sol'd Fashioned",
                "Reifel Rye, Oloroso Sherry, Rich Demerara, Angostura Bitters, Zest · 2½oz",
                "18.00", drinks, ssClassics, true, false, false);

        itemSized("House Gin n' Tonic",
                "Lime, House Made Grapefruit Tonic, Rosemary · 1½oz",
                drinks, ssClassics, false, false, false,
                new String[][]{{"Tanqueray", "14.00"}, {"Patent 5 Gin", "15.00"}, {"Hendrick's", "16.00"}});

        item("Zombie",
                "Mix of Rums, Falernum, Donn's Mix, Grenadine, Lime, Pernod · 3oz",
                "18.00", drinks, ssClassics, false, false, false);

        item("Jägerita",
                "Think Margarita, but Jäger. It's Good! · 1½oz",
                "14.00", drinks, ssClassics, false, false, false);

        item("Le Jardin",
                "Tanqueray Gin, St. Germain, Cucumber & Lavender Cordial, Lemon, Fizz, Basil Sugar · 3oz",
                "20.00", drinks, ssClassics, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // DRINKS — Non-Alcoholic
        // ══════════════════════════════════════════════════════════════════════

        item("Shirley Temple",
                "Fresh Squeezed Orange Juice, Ginger Ale, Grenadine",
                "8.00", drinks, nonAlc, false, false, false);

        item("Revitalized by Design",
                "Bonbuz Slowburn, Na Mezcal, Lime, Herbed Sugar · Contains Caffeine",
                "14.00", drinks, nonAlc, false, false, false);

        item("Date Night In",
                "Na Tequila, Strawberry Shrub, Lemon, Dates, Thai Chili",
                "14.00", drinks, nonAlc, false, true, false);

        item("Alt-Gin n' Tonic",
                "London Dry Na Gin, Lime, House Made Grapefruit Tonic, Rosemary",
                "14.00", drinks, nonAlc, false, false, false);

        item("Cucumber Collins",
                "London Dry Na Gin, Lemon, Fizz, Cucumber & Lavender Cordial",
                "14.00", drinks, nonAlc, false, false, false);

        item("Ube Cream Soda",
                "House Made Cream Soda, Ube, Lemon, Fizz",
                "8.00", drinks, nonAlc, false, false, true);

        // ══════════════════════════════════════════════════════════════════════
        // DRINKS — Bière & Cidre
        // ══════════════════════════════════════════════════════════════════════

        item("Vandelay Lager",
                "500ml",
                "9.00", drinks, bieresCidres, false, false, false);

        item("Sookram's Desert Island IPA",
                "500ml",
                "9.00", drinks, bieresCidres, false, false, false);

        item("Trois Monts Flanders Gold Ale",
                "750ml · Belgian-style golden ale",
                "18.00", drinks, bieresCidres, false, false, false);

        item("Low Life Saint Na Lager",
                "355ml · 0.5% alcohol",
                "7.00", drinks, bieresCidres, false, false, false);

        item("Next Friend Press On Cider",
                "355ml",
                "9.00", drinks, bieresCidres, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // WINE — Sparkling
        // ══════════════════════════════════════════════════════════════════════

        itemSized("Saint Louis Blanc de Blancs",
                "Ugni Blanc, Airén | NV Vin de France",
                wine, sparkling, false, false, false,
                new String[][]{{"Glass (2oz)", "11.00"}, {"Glass (5oz)", "17.00"}, {"Bottle", "47.00"}});

        item("Frantz Saumon Le Cave se Rebiffe Pet Nat",
                "Gamay, Grolleau | 2023 Loire Valley",
                "64.00", wine, sparkling, false, false, false);

        item("Low Life Fizzy Rosé",
                "Marquette, Riesling | 2023 Winnipeg, MB",
                "60.00", wine, sparkling, false, false, false);

        item("Rieffel Extra Brut",
                "Pinot Auxerrois, Pinot Gris, Riesling | 2022 Crémant d'Alsace AOC",
                "99.00", wine, sparkling, false, false, false);

        item("Laherte Frères Blanc de Blancs",
                "Chardonnay | NV Champagne AOC",
                "190.00", wine, sparkling, true, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // WINE — Rosé & Orange
        // ══════════════════════════════════════════════════════════════════════

        itemSized("Sophie Vache Rose de Sève",
                "Cinsault, Mourvèdre | NV Vin de France",
                wine, roseOrange, false, false, false,
                new String[][]{{"Glass (2oz)", "10.00"}, {"Glass (5oz)", "16.00"}, {"Bottle", "46.00"}});

        item("Château Minuty M de Minuty",
                "Grenache, Syrah, Cinsault, Tibouren | 2023 Côtes de Provence AOP",
                "70.00", wine, roseOrange, false, false, false);

        item("Domaine St. Cyr La Galoche",
                "Gamay | 2022 Beaujolais AOC",
                "64.00", wine, roseOrange, false, false, false);

        item("Domaine Le Roc Ninette",
                "Négrette, Syrah | 2022 Fronton AOC",
                "54.00", wine, roseOrange, false, false, false);

        item("Pierre Amadieu La Graninière",
                "Grenache, Cinsault, Syrah, Mourvèdre | 2023 Tavel AOC, South Rhône",
                "88.00", wine, roseOrange, false, false, false);

        item("Low Life Leaps",
                "Marquette, Vidal, Geisenheim | 2022 Winnipeg, MB",
                "60.00", wine, roseOrange, false, false, false);

        item("Gérard Bertrand Orange Gold",
                "Chardonnay, Grenache Blanc, Viognier, Marsanne, Mauzac, Muscat, Clairette | 2020 Vin de France",
                "59.00", wine, roseOrange, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // WINE — Blanc
        // ══════════════════════════════════════════════════════════════════════

        itemSized("Gérard Bertrand Héritage",
                "Picpoul | 2022 Picpoul de Pinet AOP",
                wine, blanc, false, false, false,
                new String[][]{{"Glass (2oz)", "12.00"}, {"Glass (5oz)", "19.00"}, {"Bottle", "52.00"}});

        itemSized("Château de Jau Le Jaja de Jau",
                "Sauvignon Blanc | 2024 Vin de France",
                wine, blanc, false, false, false,
                new String[][]{{"Glass (2oz)", "11.00"}, {"Glass (5oz)", "18.00"}, {"Bottle", "49.00"}});

        item("Remy Pannier Bateliers de Loire",
                "Melon B | 2022 Muscadet Sèvre-et-Maine AOP, Loire Valley",
                "53.00", wine, blanc, false, false, false);

        item("Domaine d'Édouard",
                "Aligoté | 2021 Burgundy AOC",
                "78.00", wine, blanc, false, false, false);

        item("Mary Taylor",
                "Colombard, Ugni Blanc | 2022 Gascogne IGP",
                "55.00", wine, blanc, false, false, false);

        item("Maison Les Alexandrins",
                "Marsanne | 2022 Crozes-Hermitage AOC, South Rhône",
                "110.00", wine, blanc, false, false, false);

        item("Domaine Gérard Tremblay",
                "Chardonnay | 2023 Petit Chablis AOC, Burgundy",
                "82.00", wine, blanc, false, false, false);

        item("Domaine Hubert Brochard",
                "Sauvignon Blanc | 2023 Sancerre AOP, Loire Valley",
                "78.00", wine, blanc, false, false, false);

        item("Gustave Lorentz Réserve Blanc",
                "Riesling | 2023 Alsace AOC",
                "60.00", wine, blanc, false, false, false);

        item("Louis Chèze 50 Cinquante",
                "Viognier, Chardonnay | 2022 Vin de France",
                "65.00", wine, blanc, false, false, false);

        item("Jean Geiler",
                "Pinot Gris | 2017 Alsace Grand Cru Florimont AOC",
                "78.00", wine, blanc, false, false, false);

        item("Pfaff",
                "Gewurztraminer | 2018 Alsace Grand Cru Goldert AOC",
                "86.00", wine, blanc, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // WINE — Rouge
        // ══════════════════════════════════════════════════════════════════════

        itemSized("Les Trois Pignons",
                "Merlot, Cabernet Sauvignon | 2023 Bordeaux AOC",
                wine, rouge, false, false, false,
                new String[][]{{"Glass (2oz)", "11.00"}, {"Glass (5oz)", "18.00"}, {"Bottle", "48.00"}});

        itemSized("Abbotts & Delaunay",
                "Syrah | 2019 Pays d'Oc IGP",
                wine, rouge, false, false, false,
                new String[][]{{"Glass (2oz)", "13.00"}, {"Glass (5oz)", "20.00"}, {"Bottle", "50.00"}});

        item("Gustave Lorentz Réserve Rouge",
                "Pinot Noir | 2022 Alsace AOC",
                "66.00", wine, rouge, false, false, false);

        item("Château Ollieux Romanis Toujours",
                "Cinsault | 2023 Vin de France",
                "58.00", wine, rouge, false, false, false);

        item("Marie Thibault Le Grolleau",
                "Grolleau | 2023 Vin de France",
                "70.00", wine, rouge, false, false, false);

        item("Domaine Frédéric",
                "Trousseau | 2023 Côtes du Jura AOC",
                "112.00", wine, rouge, false, false, false);

        item("Château Villenouvette Les Balmades",
                "Carignan, Syrah, Grenache | 2020 Corbières AOP, Languedoc-Roussillon",
                "53.00", wine, rouge, false, false, false);

        item("Domaine Le Roc Folle Noire d'Ambat",
                "Négrette | 2021 Fronton AOC",
                "56.00", wine, rouge, false, false, false);

        item("Vistamar Block 3 Andes",
                "Carménère | 2021 Valle de Cachapoal DO, Chile",
                "56.00", wine, rouge, false, false, false);

        item("Domaine Bernard Baudry Les Granges",
                "Cabernet Franc | 2023 Chinon AOC, Loire Valley",
                "64.00", wine, rouge, false, false, false);

        itemSized("Antoine Sunier",
                "Gamay | 2023 Régnié AOC, Beaujolais Cru",
                wine, rouge, true, false, false,
                new String[][]{{"Bottle", "78.00"}, {"Magnum (1.5L)", "150.00"}});

        item("Château de Gaudou Grande Lignée",
                "Malbec, Merlot | 2020 Cahors AOC",
                "59.00", wine, rouge, false, false, false);

        item("Phillippe Cambie Les Halos de Jupiter",
                "Grenache, Mourvèdre, Syrah | 2023 Côtes du Rhône AOC",
                "57.00", wine, rouge, false, false, false);

        item("Domaine Font Sarade",
                "Grenache, Syrah, Mourvèdre | 2020 Vacqueyras AOC, South Rhône",
                "76.00", wine, rouge, false, false, false);

        item("Château La Freynelle",
                "Cabernet Sauvignon | 2022 Bordeaux AOC",
                "72.00", wine, rouge, false, false, false);

        item("Clos des Brusquières",
                "Grenache, Syrah, Mourvèdre, Cinsault | 2021 Châteauneuf-du-Pape AOC, South Rhône",
                "150.00", wine, rouge, true, false, false);

        item("Tardieu Laurent Vieilles Vignes",
                "Syrah | 2016 Crozes-Hermitage AOC, South Rhône",
                "160.00", wine, rouge, false, false, false);

        // ── Late Night subcategories ───────────────────────────────────────────
        MenuSubcategory lnSnacks     = saveS("Late Night Snacks",  lateNite, 1);
        MenuSubcategory lnNonAlc     = saveS("Non-Alcoholic",      lateNite, 2);
        MenuSubcategory lnClassics   = saveS("Sous Sol Classics",  lateNite, 3);
        MenuSubcategory lnSigCocktails = saveS("Signature Cocktails", lateNite, 4);

        // ══════════════════════════════════════════════════════════════════════
        // LATE NIGHT — Late Night Snacks
        // ══════════════════════════════════════════════════════════════════════

        item("Oysters",
                "Mignonette, Lemon, Horseradish, Chumbawamba Sauce",
                "3.25", lateNite, lnSnacks, false, false, false);

        item("Roasted Bone Marrow",
                "Smoked Blueberry Honey, Onion Jam, Breadcrumbs, French Bread",
                "19.00", lateNite, lnSnacks, true, false, false);

        item("Bread & Butter",
                "House Baguette, Whipped Garlic Butter",
                "6.00", lateNite, lnSnacks, false, false, false);

        item("Olives",
                "Smoked, Citrus Marinade",
                "8.00", lateNite, lnSnacks, false, false, true);

        itemSized("Fromage",
                "House Jam, House Pickles, Crostini",
                lateNite, lnSnacks, false, false, false,
                new String[][]{{"Saint Paulin", "10.00"}, {"Délice de Bourgogne", "16.00"}, {"Both", "24.00"}});

        item("Roasted Brussel Sprouts",
                "Lardons, Herbed Crème Dressing, Candied Walnut, Pear",
                "16.00", lateNite, lnSnacks, false, false, false);

        item("Cured Arctic Char",
                "Crème Fraîche, Dill, Trout Roe, Crostini",
                "16.00", lateNite, lnSnacks, false, false, false);

        item("Beetroot Tartare",
                "Horseradish & Coconut Crème, Capers, Shallot, Cornichons, Pickled Mustard Seeds, French Bread",
                "16.00", lateNite, lnSnacks, false, false, true);

        item("Tartare de Boeuf",
                "Tenderloin, Egg Yolk, Capers, Shallot, Cornichons, Worcestershire, Dijon, French Bread",
                "21.00", lateNite, lnSnacks, true, false, false);

        item("Boulettes",
                "Beef Meatballs, Caramelized Onion, Gruyère, Duchesse Potato",
                "20.00", lateNite, lnSnacks, false, false, false);

        item("Potatoes Dauphinoise",
                "Gruyère, Sauce Soubise, Paprika, Truffle Oil, Dill",
                "15.00", lateNite, lnSnacks, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // LATE NIGHT — Non-Alcoholic
        // ══════════════════════════════════════════════════════════════════════

        item("No-Groni Sbagliato",
                "Peach & Ginger Infused Na Gin, Na Vermouth, Na Red Bitter, Peach Bitters, Na Sparkling Rosé",
                "14.00", lateNite, lnNonAlc, false, false, false);

        item("Revitalized by Design",
                "Bonbuz Slowburn, Na Mezcal, Lime, Herbed Sugar · Contains Caffeine",
                "14.00", lateNite, lnNonAlc, false, false, false);

        item("Date Night In",
                "Na Tequila, Lemon, Strawberry Shrub, Dates, Thai Chili",
                "14.00", lateNite, lnNonAlc, false, true, false);

        item("Alt-Gin n' Tonic",
                "London Dry Na Gin, Lime, House Made Grapefruit Tonic, Rosemary",
                "14.00", lateNite, lnNonAlc, false, false, false);

        item("Cucumber Collins",
                "London Dry Na Gin, Lemon, Cucumber & Lavender Cordial, Fizz",
                "14.00", lateNite, lnNonAlc, false, false, false);

        item("Ube Cream Soda",
                "House Cream Soda, Ube, Lemon, Coconut, Fizz",
                "8.00", lateNite, lnNonAlc, false, false, true);

        // ══════════════════════════════════════════════════════════════════════
        // LATE NIGHT — Sous Sol Classics
        // ══════════════════════════════════════════════════════════════════════

        item("Sous Sol'd Fashioned",
                "Reifel Rye, Oloroso Sherry, Rich Demerara, Angostura Bitters, Zest · 2½oz",
                "18.00", lateNite, lnClassics, true, false, false);

        itemSized("House Gin n' Tonic",
                "Lime, House Made Grapefruit Tonic, Rosemary · 1½oz",
                lateNite, lnClassics, false, false, false,
                new String[][]{{"Tanqueray", "14.00"}, {"Patent 5 Gin", "15.00"}, {"Hendrick's", "16.00"}});

        item("Jägerita",
                "Think Margarita, but Jäger. It's Good! · 1½oz",
                "14.00", lateNite, lnClassics, false, false, false);

        item("Le Jardin",
                "Tanqueray Gin, St. Germain, Lemon, Cucumber & Lavender Cordial, Fizz, Basil Sugar · Teapot",
                "20.00", lateNite, lnClassics, false, false, false);

        // ══════════════════════════════════════════════════════════════════════
        // LATE NIGHT — Signature Cocktails
        // ══════════════════════════════════════════════════════════════════════

        item("Zombie",
                "Mix of Rums, Falernum, Donn's Mix, Grenadine, Lime, Pernod · 3oz",
                "18.00", lateNite, lnSigCocktails, false, false, false);

        item("Aku Aku",
                "Black Tea-Infused Rum, Amaro Montenegro, Charred Peach, Mint, Lime, Black Pepper · 2oz",
                "17.00", lateNite, lnSigCocktails, false, false, false);

        item("Banana Beak",
                "Dark Rum, Campari, Banana, Falernum, Lime · 2oz",
                "17.00", lateNite, lnSigCocktails, false, false, false);

        item("Ube Colada",
                "Coconut Rum, Licor 43, Lemon, Ube Cream Soda, Coconut Water, Peychaud's · 2oz",
                "17.00", lateNite, lnSigCocktails, false, false, false);

        item("Campino",
                "Pandan Infused Gin, Blueberry Bitter Bianco, Greek Yogurt-Fatwash Vermouth",
                "16.00", lateNite, lnSigCocktails, false, false, false);

        item("Borrealis",
                "Mezcal, Hazelnut Grappa, Birch Syrup, Soy · Contains Nuts",
                "17.00", lateNite, lnSigCocktails, true, false, false);

        item("Snow Queen",
                "Snap Pea-Infused Vodka, White Vermouth, Menthol Bitters",
                "15.00", lateNite, lnSigCocktails, false, false, false);

        item("Head in the Clouds",
                "White Chocolate-Infused Rye, Amaro Nonino, Aperol, Lemon, Hazelnut Foam",
                "16.00", lateNite, lnSigCocktails, false, false, false);

        item("Beer & a Cigarette",
                "Dry Hopped-Rye, Islay Scotch, Lemon, Barley Macadamia Orgeat, Foamer · Contains Nuts",
                "16.00", lateNite, lnSigCocktails, false, false, false);

        item("Pisco Sour",
                "Pisco, Ginger, Lemongrass, Lemon, Egg White",
                "16.00", lateNite, lnSigCocktails, false, false, false);

        item("Hot Date",
                "Reposado Tequila, Aperol, Strawberry Shrub, Lemon, Dates, Thai Chili · 2oz",
                "17.00", lateNite, lnSigCocktails, true, true, false);

        log.info("Sous Sol menu seeded — {} items.", menuItemRepository.count());
    }

    // ── Events ────────────────────────────────────────────────────────────────
    private void seedEvents() {
        if (eventRepository.count() > 0) return;
        log.info("Seeding events...");

        eventRepository.save(Event.builder()
                .title("Gypsy Jazz Evening")
                .description("Friday nights at Sous Sol. A rotating ensemble of musicians bring the underground alive with gypsy jazz, vintage swing and improvised soul. No cover charge.")
                .date(LocalDate.now().plusDays(3))
                .time(LocalTime.of(20, 0))
                .active(true).build());

        eventRepository.save(Event.builder()
                .title("Chef's Seasonal Table")
                .description("A monthly prix fixe dinner — six courses, one table, no menu until you arrive. Limited to 12 guests. The most intimate dining experience we offer. Reservation essential.")
                .date(LocalDate.now().plusDays(14))
                .time(LocalTime.of(18, 30))
                .active(true).build());

        eventRepository.save(Event.builder()
                .title("Blanc & Rouge — Wine Tasting")
                .description("An evening exploring our cellar. Seven wines selected by our sommelier, guided tasting notes, and seasonal cheese pairings from the kitchen. Intimate and unhurried.")
                .date(LocalDate.now().plusDays(21))
                .time(LocalTime.of(19, 0))
                .active(true).build());

        eventRepository.save(Event.builder()
                .title("Private Dining Evening")
                .description("The entire space, yours for the night. Exclusive use for groups of 8 to 20. Custom menu designed around your guests. Contact us to begin the conversation.")
                .date(LocalDate.now().plusDays(30))
                .time(LocalTime.of(18, 0))
                .active(true).build());
    }

    // ── Gallery ───────────────────────────────────────────────────────────────
    private void seedGallery() {
        if (galleryRepository.count() > 0) return;
        log.info("Seeding gallery...");

        String[][] images = {
            {"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",  "interior", "Candlelit Dining"},
            {"https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",  "drinks",   "The Wine Cellar"},
            {"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800",  "drinks",   "Handcrafted Cocktails"},
            {"https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800",  "interior", "Intimate Setting"},
            {"https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800",  "interior", "The Underground"},
            {"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",     "food",     "Tartare de Boeuf"},
            {"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",     "food",     "Seasonal Selections"},
            {"https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800",     "interior", "The Bar"},
            {"https://images.unsplash.com/photo-1470119693884-47d3a1d1f180?w=800",  "food",     "Filet Mignon"},
        };

        for (int i = 0; i < images.length; i++) {
            galleryRepository.save(Gallery.builder()
                    .imageUrl(images[i][0])
                    .category(images[i][1])
                    .caption(images[i][2])
                    .displayOrder(i + 1)
                    .build());
        }
    }

    // ── Site settings ─────────────────────────────────────────────────────────
    private void seedSettings() {
        if (siteSettingsRepository.count() > 0) return;
        siteSettingsRepository.save(new SiteSettings("restaurant.name",    "Sous Sol"));
        siteSettingsRepository.save(new SiteSettings("restaurant.email",   "hello@soussol.com.au"));
        siteSettingsRepository.save(new SiteSettings("restaurant.phone",   "+61 8 8400 1234"));
        siteSettingsRepository.save(new SiteSettings("restaurant.address", "Below the streets of Norwood, Adelaide SA 5067"));
        siteSettingsRepository.save(new SiteSettings("social.instagram",   "soussol"));
        siteSettingsRepository.save(new SiteSettings("social.facebook",    ""));
        siteSettingsRepository.save(new SiteSettings("social.tiktok",      ""));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private MenuCategory saveC(String name, String desc, int order) {
        return menuCategoryRepository.save(
                MenuCategory.builder().name(name).description(desc).displayOrder(order).build());
    }

    private MenuSubcategory saveS(String name, MenuCategory cat, int order) {
        return menuSubcategoryRepository.save(
                MenuSubcategory.builder().name(name).category(cat).displayOrder(order).build());
    }

    /** Standard item (single price). */
    private void item(String name, String desc, String price,
                      MenuCategory cat, MenuSubcategory subcat,
                      boolean popular, boolean spicy, boolean vegan) {
        menuItemRepository.save(MenuItem.builder()
                .name(name).description(desc).price(new BigDecimal(price))
                .category(cat).subcategory(subcat)
                .isPopular(popular).isSpicy(spicy).isVegan(vegan).isActive(true)
                .build());
    }

    /** Item with multiple size/price variants (e.g. glass vs bottle, six vs dozen). */
    private void itemSized(String name, String desc,
                           MenuCategory cat, MenuSubcategory subcat,
                           boolean popular, boolean spicy, boolean vegan,
                           String[][] sizeData) {
        // Base price = smallest size
        MenuItem mi = menuItemRepository.save(MenuItem.builder()
                .name(name).description(desc).price(new BigDecimal(sizeData[0][1]))
                .category(cat).subcategory(subcat)
                .isPopular(popular).isSpicy(spicy).isVegan(vegan).isActive(true)
                .build());
        for (String[] s : sizeData) {
            mi.getSizes().add(
                    ItemSize.builder()
                            .name(s[0]).price(new BigDecimal(s[1]))
                            .menuItem(mi)
                            .build());
        }
        menuItemRepository.save(mi);
    }
}
