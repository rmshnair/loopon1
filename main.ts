namespace SpriteKind {
    export const Cursort = SpriteKind.create()
    export const PlacableTile = SpriteKind.create()
    export const PlaceableTile = SpriteKind.create()
    export const Highlight = SpriteKind.create()
    export const Health = SpriteKind.create()
    export const LaunchButton = SpriteKind.create()
    export const LAZER = SpriteKind.create()
}
namespace StatusBarKind {
    export const XP = StatusBarKind.create()
}
function getPathToFire () {
    tiles.setWallAt(tiles.locationInDirection(fire_loc, CollisionDirection.Bottom), true)
    leg1 = scene.aStar(tiles.locationOfSprite(hero), tiles.locationInDirection(tiles.locationInDirection(fire_loc, CollisionDirection.Bottom), CollisionDirection.Bottom))
    tiles.setWallAt(tiles.locationInDirection(fire_loc, CollisionDirection.Bottom), false)
    leg2 = scene.aStar(tiles.locationInDirection(tiles.locationInDirection(fire_loc, CollisionDirection.Bottom), CollisionDirection.Bottom), fire_loc)
    for (let value of leg2) {
        leg1.push(value)
    }
    return leg1
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (highlightedSprite && cursor.overlapsWith(highlightedSprite)) {
        isCarrying = true
        setCursor("grab")
    }
})
scene.onPathCompletion(SpriteKind.Player, function (sprite, location) {
    info.changeScoreBy(1)
    startLoop()
})
function levelUp () {
    level += 1
    damage += randint(2, 3)
    xpBar.value = 0
    xpBar.max = Math.round(20 + 20 * 1.1 ** level)
    textSprite = textsprite.create("LEVEL UP", 0, 4)
    textSprite.setMaxFontHeight(24)
    textSprite.setOutline(1, 1)
    textSprite.setPosition(80, 60)
    textSprite.lifespan = 1000
    animation.runMovementAnimation(
    textSprite,
    "m 4 -1 m 1 2 m -6 2 m -4 -8 m 8 8 m 2 -4 m -8 0 m 6 3 m -3 -2 m 4 -1 m 1 2 m -6 2 m -4 -8 m 8 8 m 2 -4 m -8 0 m 6 3 m -3 -2 m 4 -1 m 1 2 m -6 2 m -4 -8 m 8 8 m 2 -4 m -8 0 m 6 3 m -3 -2 m 4 -1 m 1 2 m -6 2 m -4 -8 m 8 8 m 2 -4 m -8 0 m 6 3 m -3 -2",
    1000,
    false
    )
    textSprite.startEffect(effects.confetti, 1000)
}
sprites.onOverlap(SpriteKind.LAZER, SpriteKind.Enemy, function (sprite, otherSprite) {
    statusbars.getStatusBarAttachedTo(StatusBarKind.Health, otherSprite).value += -0.25
})
function makeATile (image2: Image, name: string, placeOnRoad: boolean) {
    newTile = sprites.create(image2, SpriteKind.PlaceableTile)
    sprites.setDataString(newTile, "name", name)
    newTile.setFlag(SpriteFlag.GhostThroughWalls, true)
    sprites.setDataBoolean(newTile, "placeOnRoad", placeOnRoad)
    return newTile
}
sprites.onOverlap(SpriteKind.Cursort, SpriteKind.PlaceableTile, function (sprite, otherSprite) {
    highlightedSprite = otherSprite
    highlightSprite.setPosition(highlightedSprite.x, highlightedSprite.y)
})
statusbars.onZero(StatusBarKind.Health, function (status) {
    inCombat = false
    status.spriteAttachedTo().destroy()
    if (status.spriteAttachedTo() != hero) {
        xpBar.value += sprites.readDataNumber(status.spriteAttachedTo(), "XP")
        if (xpBar.value == xpBar.max) {
            levelUp()
        }
    }
    continuePath()
})
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    if (isCarrying) {
        isCarrying = false
        setCursor("arrow")
        if (highlightedSprite.tileKindAt(TileDirection.Center, assets.tile`myTile0`) && sprites.readDataBoolean(highlightedSprite, "placeOnRoad")) {
            tiles.setTileAt(tiles.locationOfSprite(highlightedSprite), highlightedSprite.image)
            highlightedSprite.destroy()
            arrangeInventory()
        } else if (highlightedSprite.tileKindAt(TileDirection.Center, assets.tile`myTile3`) && !(sprites.readDataBoolean(highlightedSprite, "placeOnRoad"))) {
            tiles.setTileAt(tiles.locationOfSprite(highlightedSprite), highlightedSprite.image)
            highlightedSprite.destroy()
            arrangeInventory()
        }
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Health, function (sprite, otherSprite) {
    otherSprite.destroy()
    statusbars.getStatusBarAttachedTo(StatusBarKind.Health, hero).value += 5
})
function addToInventory (tile: Sprite) {
    inventory.push(tile)
    arrangeInventory()
}
function continuePath () {
    leg1 = getPathToFire()
    scene.followPath(hero, leg1, 50)
}
function arrangeInventory () {
    for (let index = 0; index <= inventory.length - 1; index++) {
        inventory[index].top = 113
        inventory[index].left = 8 + index * 20
    }
}
function startLoop () {
    continuePath()
    for (let value of tiles.getTilesByType(assets.tile`myTile0`)) {
        if (Math.percentChance(10)) {
            blob = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . 7 7 7 7 . . . . . . 
                . . . . 7 7 1 1 7 7 7 7 7 . . . 
                . . . 7 7 1 7 7 7 7 7 7 7 7 . . 
                . . . 7 1 7 7 7 7 7 7 7 7 7 . . 
                . . 7 7 7 7 7 7 7 7 7 7 7 7 . . 
                . . 7 7 1 7 7 7 1 7 7 7 7 7 7 . 
                . . 7 7 7 7 7 7 7 7 7 7 7 7 7 . 
                . . 7 7 7 7 7 7 7 7 7 7 7 7 7 . 
                . . 7 7 7 7 1 1 6 6 7 7 7 7 7 . 
                . . 7 7 7 7 7 7 6 6 7 7 7 7 7 . 
                . . 7 7 7 7 7 7 7 6 7 7 7 7 . . 
                . . . 7 7 7 7 7 7 7 7 7 7 . . . 
                . . . . 7 7 7 7 7 7 7 7 . . . . 
                . . . . . . . 7 7 7 7 . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.Enemy)
            animation.runImageAnimation(
            blob,
            [img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . d d . . . . . . . 
                . . . . . . d 1 1 d . . . . . . 
                . . . . . . d 1 1 d . . . . . . 
                . . . . . . . d d . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `,img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . d . . . . . 
                . . . . d . . . . d d . . . . . 
                . . . . d d . . d 1 d . . . . . 
                . . . . . d d d 1 1 d . . . . . 
                . . . . . d 1 1 1 1 d . . . . . 
                . . . . . . d 1 1 1 1 d . . . . 
                . . . . . . d 1 d d d d . . . . 
                . . . . . . d d . . d d d . . . 
                . . . . . d d . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                `,img`
                . d . . . . . . . . . . . d . . 
                . d d . . . . . . . . . d d . . 
                . d d d . . d d . . d d d d . . 
                . . 1 d d d 1 1 d d d d d d . . 
                . . d d 1 d 1 1 d 1 1 d d d . . 
                . . d 1 1 1 1 1 1 1 1 1 1 d . . 
                . d 1 1 1 1 1 1 1 1 1 1 d d d . 
                . d d 1 1 1 1 1 1 1 1 1 1 1 d . 
                . d d 1 1 1 1 1 1 1 1 d 1 1 d . 
                . . d d d 1 1 1 d 1 1 d d d d . 
                . d 1 1 d 1 1 1 d d d 1 1 d . . 
                . d 1 1 d d 1 d d d d 1 1 d . . 
                . d d d d d d d d d d d d d . . 
                . . d 1 d d d d d d d d d . . . 
                . d 1 d . . d d d . . . d d . . 
                . d d . . . . . . . . . . d d . 
                `,img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . . . . . . . . . . 
                . . . . . d d . d d d . . . . . 
                . . . . d 1 1 d 1 1 1 d . . . . 
                . . d d 1 1 1 d d 1 d d d d . . 
                . d 1 1 d d d d d d d 1 1 d . . 
                . d 1 1 1 d . . . . . d d d d . 
                . . 1 d d d . . . . . d d 1 1 d 
                . d 1 d 1 . . . . . . . d 1 1 d 
                . d 1 1 d . . . . . . d d 1 d d 
                . d 1 d d . . . . . . d d 1 d d 
                . d d d d d . . . . d d d d d . 
                . d d d d d d . d d 1 d d 1 d . 
                . . d d d 1 1 d d 1 1 d d d . . 
                . . . d d d d d d d d d . . . . 
                . . . . . . d d d d d . . . . . 
                `,img`
                . . . . . . f f f f . . . . . . 
                . . . . f f 7 7 7 7 f f f . . . 
                . . . f 7 7 1 1 7 7 7 7 7 f . . 
                . . f 7 7 1 7 7 7 7 7 7 7 7 f . 
                . . f 7 1 7 7 7 7 7 7 7 7 7 f . 
                . f 7 7 7 7 7 7 7 7 7 7 7 7 f . 
                . f 7 7 1 7 7 7 1 7 7 7 7 7 7 f 
                . f 7 7 7 7 7 7 7 7 7 7 7 7 7 f 
                . f 7 7 7 7 7 7 7 7 7 7 7 7 7 f 
                . f 7 7 7 7 1 1 6 6 7 7 7 7 7 f 
                . f 7 7 7 7 7 7 6 6 7 7 7 7 7 f 
                . . f 7 7 7 7 7 7 6 7 7 7 7 f . 
                . . . f 7 7 7 7 7 7 7 7 7 f . . 
                . . . . f 7 7 7 7 7 7 f f . . . 
                . . . . . f f f f f f . . . . . 
                . . . . . . . . . . . . . . . . 
                `],
            100,
            false
            )
            statusbar = statusbars.create(10, 1, StatusBarKind.Health)
            statusbar.attachToSprite(blob)
            statusbar.max = 10
            tiles.placeOnTile(blob, value)
            sprites.setDataNumber(blob, "XP", 10)
        }
    }
    for (let value of tiles.getTilesByType(assets.tile`myTile2`)) {
        for (let adjacentTile of [
        tiles.locationInDirection(value, CollisionDirection.Left),
        tiles.locationInDirection(value, CollisionDirection.Top),
        tiles.locationInDirection(value, CollisionDirection.Right),
        tiles.locationInDirection(value, CollisionDirection.Bottom)
        ]) {
            if (tiles.tileIs(adjacentTile, assets.tile`myTile0`)) {
                tempSprite = sprites.create(img`
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    `, SpriteKind.Health)
                tiles.placeOnTile(tempSprite, adjacentTile)
                tempSprite.setFlag(SpriteFlag.Invisible, true)
            }
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.LaunchButton, function (sprite, otherSprite) {
    otherSprite.destroy()
    mySprite = sprites.create(img`
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        `, SpriteKind.LAZER)
    animation.runImageAnimation(
    mySprite,
    [img`
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        `,img`
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        `,img`
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        `,img`
        ................................................................................................................................................................
        ................................................................................................................................................................
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        ................................................................................................................................................................
        ................................................................................................................................................................
        `,img`
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        3333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        `,img`
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        ................................................................................................................................................................
        `],
    100,
    false
    )
    tiles.placeOnTile(mySprite, tiles.getTileLocation(0, sprites.readDataNumber(otherSprite, "row")))
    mySprite.x = 80
    mySprite.lifespan = 600
    mySprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        f f f f . . . . . . . . f f f f 
        f 1 1 f f f f f f f f f f 1 1 f 
        f 1 1 f 1 1 1 1 1 1 1 1 f 1 1 f 
        f 1 1 f 1 1 1 1 1 1 1 1 f 1 1 f 
        f 1 1 f 1 1 1 1 1 1 1 1 f 1 1 f 
        f 1 1 f 1 1 1 1 1 1 1 1 f 1 1 f 
        f 1 1 f 1 1 f f f f 1 1 f 1 1 f 
        f 1 1 f 1 f f 1 1 f f 1 f 1 1 f 
        f 1 1 f 1 f 1 1 1 1 f 1 f 1 1 f 
        f 1 1 f f f 1 1 1 1 f f f 1 1 f 
        f f f f f f 1 1 1 1 f f f f f f 
        . . . f f f f f f f f f f . . . 
        . . . f 1 1 1 1 1 1 1 1 f . . . 
        . . . f f f f f f f f f f . . . 
        `, SpriteKind.Food)
    tiles.placeOnTile(mySprite, tiles.getTileLocation(sprites.readDataNumber(otherSprite, "col"), sprites.readDataNumber(otherSprite, "row")))
    mySprite.lifespan = 600
})
sprites.onDestroyed(SpriteKind.Player, function (sprite) {
    game.over(false)
})
function setCursor (cursorType: string) {
    if (cursorType == "arrow") {
        cursor.setImage(img`
            . . f f . . . . . . . . 
            . . f 3 f f . . . . . . 
            . . f 3 3 3 f f . . . . 
            . . f 3 3 3 3 3 f f . . 
            . . f 3 3 3 3 3 3 3 f . 
            . . f 3 3 3 3 3 3 f . . 
            . . f 3 3 3 3 f f . . . 
            . . f 3 3 f 3 3 f . . . 
            . . f 3 f . f 3 3 f . . 
            . . . f . . . f 3 3 f . 
            . . . . . . . . f f . . 
            . . . . . . . . . . . . 
            `)
    } else if (cursorType == "pointer") {
        cursor.setImage(img`
            . . . . . . . . . . . . 
            . . . . . . . . f . . . 
            . . . . . . . f 3 f . . 
            . . f . f . f f 3 f . . 
            . f 3 f 3 f 3 f 3 f . . 
            . f 3 f 3 f 3 f 3 f f . 
            . f 3 f 3 f 3 f 3 f 3 f 
            . f 3 3 3 3 3 3 3 f 3 f 
            . f 3 3 3 3 3 3 3 f f . 
            . . f 3 3 3 3 3 f . . . 
            . . f 3 3 3 3 3 f . . . 
            . . . f f f f f . . . . 
            `)
    } else if (cursorType == "grab") {
        cursor.setImage(img`
            . . . . . . . . . . . . 
            . . . . . . . . . . . . 
            . . . . . . . . . . . . 
            . . f . f . f . f . . . 
            . f 3 f 3 f 3 f 3 f . . 
            . f 3 f 3 f 3 f 3 f f . 
            . f 3 f 3 f 3 f 3 f 3 f 
            . f 3 3 3 3 3 3 3 f 3 f 
            . f 3 3 3 3 3 3 3 f f . 
            . . f 3 3 3 3 3 f . . . 
            . . f 3 3 3 3 3 f . . . 
            . . . f f f f f . . . . 
            `)
    }
}
function doAttack (attacker: Sprite, attackee: Sprite, interval: number, dmg: number) {
    timer.after(interval, function () {
        if (inCombat && (combatTarget == attacker || combatTarget == attackee)) {
            statusbars.getStatusBarAttachedTo(StatusBarKind.Health, attackee).value += 0 - dmg
            doAttack(attacker, attackee, interval, dmg)
        }
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (!(inCombat)) {
        scene.followPath(sprite, [][0])
        combatTarget = otherSprite
        inCombat = true
        doAttack(sprite, otherSprite, 1000, damage)
        doAttack(otherSprite, sprite, 200, 1)
    }
})
let mySprite: Sprite = null
let tempSprite: Sprite = null
let statusbar: StatusBarSprite = null
let blob: Sprite = null
let newTile: Sprite = null
let textSprite: TextSprite = null
let isCarrying = false
let highlightedSprite: Sprite = null
let leg2: tiles.Location[] = []
let leg1: tiles.Location[] = []
let level = 0
let highlightSprite: Sprite = null
let inventory: Sprite[] = []
let cursor: Sprite = null
let combatTarget: Sprite = null
let inCombat = false
let fire_loc: tiles.Location = null
let hero: Sprite = null
let damage = 0
let xpBar: StatusBarSprite = null
tiles.setTilemap(tilemap`level1`)
xpBar = statusbars.create(40, 6, StatusBarKind.XP)
xpBar.value = 0
xpBar.max = 20
xpBar.setBarBorder(1, 1)
xpBar.left = 2
xpBar.top = 2
xpBar.setColor(4, 11)
xpBar.setLabel("XP")
damage = 5
hero = sprites.create(img`
    . . . c c . . . . . . . . . . . 
    . . c 3 6 c c c c . . . . . . . 
    . . c 6 3 3 3 3 6 c . . . . . . 
    . c 3 3 3 3 3 c c 6 c . c c . . 
    c 3 3 3 3 3 c 5 5 c 6 c 5 5 b . 
    c 3 3 3 3 3 f f 5 c 6 c 5 f f . 
    c c 3 3 3 6 f f 5 c 6 c 5 f f . 
    c c 6 6 6 6 c 5 5 3 c 3 5 5 b . 
    c 3 3 3 3 3 3 c 5 5 3 5 5 b . . 
    c 3 3 3 3 c c b 5 5 5 5 5 c c . 
    . c 3 3 c 5 5 b 4 5 5 5 4 5 5 c 
    . . b b c 5 b b 4 4 4 4 b 4 5 b 
    . b 5 4 c 4 5 5 5 b 4 b 5 5 4 c 
    . c 5 c 4 c 5 5 5 c 4 c 5 5 5 c 
    . c 5 c 4 c 5 5 5 5 c 5 5 5 5 c 
    . c c c . . c c c c c c c c c . 
    `, SpriteKind.Player)
let hero_health = statusbars.create(10, 1, StatusBarKind.Health)
hero_health.attachToSprite(hero)
hero_health.max = 100
tiles.placeOnRandomTile(hero, assets.tile`myTile`)
fire_loc = tiles.getTilesByType(assets.tile`myTile`)[0]
inCombat = false
combatTarget = hero
startLoop()
cursor = sprites.create(img`
    . . . . . . . . . . . . 
    . . . . . . . . f . . . 
    . . . . . . . f 3 f . . 
    . . f . f . f f 3 f . . 
    . f 3 f 3 f 3 f 3 f . . 
    . f 3 f 3 f 3 f 3 f f . 
    . f 3 f 3 f 3 f 3 f 3 f 
    . f 3 3 3 3 3 3 3 f 3 f 
    . f 3 3 3 3 3 3 3 f f . 
    . . f 3 3 3 3 3 f . . . 
    . . f 3 3 3 3 3 f . . . 
    . . . f f f f f . . . . 
    `, SpriteKind.Cursort)
cursor.z = 10
cursor.setFlag(SpriteFlag.GhostThroughWalls, true)
controller.moveSprite(cursor, 70, 70)
inventory = []
addToInventory(makeATile(assets.tile`myTile2`, "inn", false))
addToInventory(makeATile(assets.tile`myTile4`, "cannon", false))
addToInventory(makeATile(assets.tile`myTile5`, "bat", true))
addToInventory(makeATile(assets.tile`myTile6`, "coral?", true))
addToInventory(makeATile(assets.tile`myTile7`, "buried?", true))
highlightSprite = sprites.create(img`
    333333333333333333
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    3................3
    333333333333333333
    `, SpriteKind.Highlight)
highlightSprite.setFlag(SpriteFlag.Invisible, true)
setCursor("pointer")
scene.centerCameraAt(0, 73)
level = 0
game.onUpdate(function () {
    if (isCarrying) {
        highlightSprite.setFlag(SpriteFlag.Invisible, true)
        highlightedSprite.setPosition(cursor.x, cursor.y)
    } else {
        highlightSprite.setFlag(SpriteFlag.Invisible, !(highlightedSprite && cursor.overlapsWith(highlightedSprite)))
        if (highlightedSprite && cursor.overlapsWith(highlightedSprite)) {
            setCursor("pointer")
        } else {
            setCursor("arrow")
        }
    }
})
