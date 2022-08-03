const DIR_PATH = "./plugins/DeathChest/";

const DEATH_EVENT = "onPlayerDie";
const CHEST_TYPE = "chest";
const SIGN = "standing_sign";

function debug(data) {
    mc.broadcast('§4debug:' + data);
}

function getPlayerCt(pl) {
    if (!pl) return [];

    let ct = pl.getInventory().getAllItems();

    ct.push(...pl.getArmor().getAllItems(), pl.getOffHand());

    return ct;
}

function generateChest(intPos){
    //生成一个大箱子
    mc.runcmdEx(`setblock ${intPos.x} ${intPos.y} ${intPos.z} ${CHEST_TYPE}`);

    mc.runcmdEx(`setblock ${intPos.x+1} ${intPos.y} ${intPos.z} ${CHEST_TYPE}`);

    return mc.getBlock(intPos);
}

function generateSign(intPos,pl){

    mc.runcmdEx(`setblock ${intPos.x} ${intPos.y +1} ${intPos.z} ${SIGN}`);

    let ble = mc.getBlock(intPos.x,intPos.y + 1,intPos.z,intPos.dimid).getBlockEntity();

    let newNbt = ble.getNbt();

    newNbt.setString("Text",`§l坐标: ${intPos.x},${intPos.y},${intPos.z}\n玩家: ${pl.name}\n掉落的战利品箱子`);

    ble.setNbt(newNbt);
}

function fillContainer(ct,pack) {

    for (let i = 0; i < pack.getAllItems().length; i++) {
        let item = pack.getItem(i);

        if (item.name !== ""){
            ct.addItem(mc.newItem(item.getNbt()));
            pack.removeItem(i,64)
        }
    }
}

function fillChest(pl,chest){

    let ct = chest.getContainer();
    //背包
    fillContainer(ct,pl.getInventory());

    pl.refreshItems();
}

function deathProcess(pl, sc) {

    if (!pl) return;

    //获取玩家坐标对象
    let pl_intPos = pl.blockPos;

    //生成箱子
    let chest = generateChest(pl_intPos);

    //填充箱子
    fillChest(pl,chest);

    //生成告示牌
    generateSign(pl_intPos,pl);

}

mc.listen(DEATH_EVENT,deathProcess);

