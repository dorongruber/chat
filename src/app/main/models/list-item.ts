export class ListItem {
    private _id: string;
    private _name: string;
    private _description: string;
    private _img: File;
    private _icon: string | undefined;
    constructor(
        _id: string,
        _name: string,
        _description: string,
        {_img = new File([],'emptyFile'), _icon = undefined} : {_img?: File, _icon?: string},
    ) {
        this._id = _id;
        this._name = _name;
        this._img = _img;
        this._icon = _icon;
        this._description = _description;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get img() {
        return this._img;
    }

    get description() {
        return this._description;
    }

    get icon() {
        return this._icon;
    }

}