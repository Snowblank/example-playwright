import { Page } from "@playwright/test";

export async function selectSeatAvailable(page: Page) {
    await page.evaluate(() => {
        const stages = window.Konva?.stages;
        if (!stages || stages.length === 0) return [];
        const seatDatas = window.Konva.stages[1].find('.seat-data')

        //find Available seat 
        const seatAvailables = seatDatas.filter(node=> node.attrs?.['objData'].status === "AVAILABLE")

        seatAvailables[0].fire('click')
    });
}