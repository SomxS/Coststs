class Complements {

    constructor(link, div_modulo) {
        this._link = link;
        this._div_modulo = div_modulo;
    }


    ObjectMerge(target, source) {
        // Iterar sobre todas las claves del objeto fuente
        for (const key in source) {
            // Verificar si la propiedad es propia del objeto fuente
            if (source.hasOwnProperty(key)) {
                // Verificar si el valor es un objeto y si el target tiene la misma propiedad
                if (typeof source[key] === 'object' && source[key] !== null) {
                    // Si el target no tiene la propiedad o no es un objeto, inicializarla como un objeto vacío
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    // Llamada recursiva para combinar sub-objetos
                    this.ObjectMerge(target[key], source[key]);
                } else {
                    // Si no es un objeto, asignar el valor directamente
                    target[key] = source[key];
                }
            }
        }
        return target;
    }


    useFetch(options) {

        // Valores predeterminados
        let defaults = {
            method: 'POST',
            data: { opc: 'ls' },
            url: this._link, // La URL debe ser especificada en las opciones
            success: () => { } // Función vacía por defecto
        };

        // Mezclar los valores predeterminados con las opciones proporcionadas
        let opts = Object.assign({}, defaults, options);

        // Validar que la URL esté definida
        if (!opts.url) {
            console.error('URL es obligatoria.');
            return;
        }

        // Realizar la petición fetch
        fetch(opts.url, {
            method: opts.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(opts.data),
        })
            .then((response) => response.json())
            .then((data) => {
                // Llamar a la función success si se proporciona
                if (typeof opts.success === 'function') {
                    opts.success(data);
                }
            })
            .catch((error) => {
                console.error('Error en la petición:', error);
            });
    }

}

class Components extends Complements {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    createfilterBar(options) {

        let defaults = {
            id: 'idFilterBar',
            parent: 'filterBar',
            json: [
                {
                    opc: "input-calendar",
                    id: "iptDate",
                    tipo: "text",
                    class: "col-6 col-sm-3",
                    lbl: "Fecha de movimiento",
                },
                {
                    opc: "btn",
                    fn: "Buscar()",
                    color: 'primary',
                    text: "Buscar",
                    class: "col-sm-2",
                },
            ]

        };

        //  Combinar objetos 
        let opts = Object.assign(defaults, options);
        $(`#${opts.parent}`).content_json_form({ data: opts.data, type: '', id: opts.id });



    }


    createTab(options) {
        let txt = "";

        var defaults = {
            data: [],
            id: "myTab",
            parent: "tabs",
        };

        // Carga opciones por defecto
        var opts = Object.assign({}, defaults, options);

        // Creamos el contenedor
        var div = $("<div>", {
            class: " ",
        });

        var ul = $("<ul>", {
            class: "nav nav-tabs",
            id: opts.id,
        });

        var div_content = $("<div>", {
            class: "tab-content ",
        });

        for (const x of opts.data) {
            let active = "";
            let tab_active = "";
            if (x.active) {
                active = "active";
                tab_active = "show active";
            }

            var li = $("<li>", {
                class: "nav-item",
            });

            // if(x.fn) 



            // li.html(`<a class="nav-link ${active}" 
            //     id="${x.id}-tab"  data-bs-toggle="tab" href="#${x.id}"  onclick="${x.fn}"> ${x.tab}</a>  `);
            li.append(
                $('<a>', {
                    class: "nav-link " + active,
                    id: x.id + "-tab",
                    "data-bs-toggle": "tab",
                    href: "#" + x.id,
                    onclick: x.fn,
                    text: x.tab
                })
            );
            var div_tab = $("<div>", {
                class: "tab-pane fade  mt-2 " + tab_active,
                id: x.id,
            });

            if (x.contenedor) {
                // let div_contenedor = $("<div>", {
                //     class: "row",
                // });

                for (const y of x.contenedor) {
                    var div_cont = $("<div>", {
                        class: y.class,
                        id: y.id,
                    });

                    div_tab.append(div_cont);
                }

                // div_tab.append(div_contenedor);
            }

            ul.append(li);
            div_content.append(div_tab);
        }

        div.append(ul);
        div.append(div_content);
        $(`#${opts.parent}`).html(div);
    }

    async createPosCard(options){
        let defaults = {  parent: '', data  : [],  type  : 'details' };
        let card;   
        let opts = { ...defaults, ...options };


        let data = await useFetch({
            url: 'https://erp-varoch.com/ERP24/produccion/control-fogaza/ctrl/ctrl-pedidos.php',
            data: { opc: 'getProductsByFol', NoFolio: 32 }
            });

    
        data.row.map((Element) => {    
    
            // Components. 
            let iconContainer = () => {

                var span = $('<span>', {
                    class: 'fs-6 text-uppercase',
                    click: function() {
                        $('#img-photo').click();  
                    }
                }).append(
                    $('<i>', {
                        class: 'icon-camera fs-4'
                    })
                ).append('subir');

                if (Element.src) {
                    
                    return $('<div>', {
                        class: 'w-32 h-32  p-1 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden',
                        id:'content_photo'
                    }).append(
                        $('<img>', {
                            src: 'https://erp-varoch.com/'+Element.src,
                            class: 'w-full h-full object-cover rounded-lg',
                            id: 'img-photo',
                        }),
                        $('<input>', {
                            type: 'file',
                            class: 'hide',
                            id: 'photo-receta',
                            accept: '.jpg, .jpeg, .png'
                        }),
                        span
                    );

                } else {


                    return $('<div>', {
                        class: 'flex w-32 h-32 mr-4 p-2 bg-gray-100 rounded-lg items-center pointer justify-center',
                        id:'content_photo'

                    }).append(
                        $('<i>', {
                            class: 'icon-birthday text-gray-500 text-3xl'
                        }),
                        // $('<img>', {
                        //     src: 'https://erp-varoch.com/'+Element.src,
                        //     id: 'img-photo',
                        //     class: 'w-full h-full object-cover rounded-lg',
                        // }),
                        $('<input>', {
                            type: 'file',
                            class: 'hide',
                            id: 'photo-receta',
                            accept: '.jpg, .jpeg, .png',
                        
                        }).on('change', function() {
                            photoReceta();
                        }),
                        span
                    );
                }
            };

            let detailsContainer = ()=>{

                let div = $('<div>', {
                    class: 'w-2/4 flex flex-col flex-grow line'
                });


                div.append(
                    $('<span>', {
                        class: 'text-xs font-semibold mb-1 text-gray-800',
                        html: `MODELO: ${Element.valor}`
                    }),
                   

                ) ;   


                return div;

            }

            let buttonsContainer = ()=>{

          

                return $('<div>', {
                    class: ' w-1/4 flex justify-center items-center gap-3'
                }).append(

                    $('<button>', {
                        class: 'text-blue-500 hover:text-blue-700',
                        html: '<i class="icon-pencil"></i>',
                        click: () => {
                            this.modalEditTicket(Element.id);
                        }
                    }),
                    $('<button>', {
                        class: 'text-red-500 hover:text-red-700',
                        html: '<i class="icon-music"></i>',
                        click: () => {
                            this.removeItem(Element.id);
                        }
                    }),


                );

            }

            card = $('<div>', {
                class: 'flex  border border-gray-300 rounded-lg p-2 '
            });


            card.append(iconContainer,detailsContainer(),buttonsContainer())

        });


        $('#' + opts.parent).html(card);

    } 

    async createItemCard(options) {
        let defaults = { parent: 'container', data: [], type: '' };
        let opts = { ...defaults, ...options };

        // conection
        let data = await useFetch({
        url: 'https://erp-varoch.com/ERP24/produccion/control-fogaza/ctrl/ctrl-pedidos.php',
        data: { opc: 'getProductsByFol', NoFolio: 32 }
        });



        let div = $('<div>', { class: ' border border-gray-300 ' });
        div.append($('<h1>', { class: 'p-4 text-center font-bold' , text: 'PEDIDOS DE PASTEL' }));
        
           
        
        
                let card = $("<div>", {
                    class: 'flex  grid grid-cols-2 gap-1 text-sm px-3  py-3 rounded-sm '
        
                });


        


        div.append($('<hr>', { class: 'py-2 mx-2' }));


        const products = [
            {
                "Modelo": data.row[0].valor,
                'Relleno': 'Chocolate',
                "leyenda": data.row[0].leyenda,
                'NoPersonas': 22,
                "observaciones": '',
            }
        ];

        products.forEach((item, index) => {
            Object.entries(item).forEach(([key, value]) => {

                let text = $('<div>', {
                    class: 'text-sm font-semibold text-uppercase  text-gray-600',
                    html: `${key} : `
                });

                let val = $('<div>', {
                    class: 'text-right text-gray-600',
                    html: `${value}  `
                });




                card.append(text, val);


            });
        });

        div.append(card);

        div.append($('<hr>', { class: 'py-2 mx-2' }));

        const summaryData = [,
            { key: 'IMPORTE BASE', value: 1 },
            { key: 'ANTICIPO', value: 1 },
            { key: 'MONTO TOTAL', value: 1 },
        ];

        let endcard = $('<div>', {
            class: 'flex grid grid-cols-2 gap-1 text-sm px-3 py-3 rounded-sm'
        });

        summaryData.forEach(({ key, value }) => {
               let text = $('<div>', {
                    class: 'text-sm font-semibold text-uppercase  text-gray-600',
                    html: `${key} : `
                });

                let val = $('<div>', {
                    class: 'text-right text-gray-600',
                    html: `${value}  `
                });

            endcard.append(text, val);
        });

        div.append(endcard);






        $('#' + opts.parent).html(div);
    }

}

class Templates extends Components {
    constructor(link, div_modulo) {
        super(link, div_modulo);
    }

    createLayaout(options = {}) {
        const defaults = {
            design: true,
            content: this._div_modulo,
            parent: '',
            clean: false,
            data: { id: "rptFormat", class: "col-12" },
        };

        const opts = Object.assign({}, defaults, options);
        const lineClass = opts.design ? ' block ' : '';

        const div = $("<div>", {
            class: opts.data.class,
            id: opts.data.id,
        });

        const row = opts.data.contenedor ? opts.data.contenedor : opts.data.elements;

        row.forEach(item => {
            let div_cont;

            switch (item.type) {

                case 'div':

                    div_cont = $("<div>", {
                        class: (item.class ? item.class : 'row') + ' ' + lineClass,
                        id: item.id,
                    });

                    if (item.children) {
                        item.children.forEach(child => {
                            child.class = (child.class ? child.class + ' ' : '') + lineClass;

                            if (child.type) {

                                div_cont.append($(`<${child.type}>`, child));

                            } else {

                                div_cont.append($("<div>", child));
                            }

                        });
                    }

                    div.append(div_cont);

                    break;

                default:

                    const { type, ...attr } = item;


                    div_cont = $("<" + item.type + ">", attr);

                    div.append(div_cont);
                    break;
            }
        });


        // aplicar limpieza al contenedor

        if (opts.clean)
            $("#" + opts.content ? opts.content : opts.parent).empty();


        if (!opts.parent) {
            $("#" + opts.content).html(div);
        } else {
            $("#" + opts.parent).html(div);
        }

    }

    createPlantilla(options) {

        let json_components = {
            id: "mdlGastos",
            class: "card-body row m-2",

            contenedor: [
                {
                    type: "form",
                    id: "formGastos",
                    class: " col-lg-4  block pt-2",
                    novalidate: true,
                },

                {
                    type: "div",
                    id: "contentGast",
                    class: "col-lg-8 ",
                    children: [
                        { class: 'col-12', id: 'filterGastos' },
                        { class: 'col-12', id: 'tableGastos' }
                    ]
                },
            ]
        };


        var defaults = { data: json_components, design: true };
        let opts = Object.assign(defaults, options);
        this.createLayaout(opts);

    }

    primaryLayout(options) {

        let defaults = {
            id: '',
            parent: this._div_modulo,
            className: "d-flex mx-2 my-2 h-100",


            card: {
                name: "singleLayout",
                class: "col-12",
                filterBar: { className: 'w-full  line', id: 'filterBar' },
                container: { className: 'w-full my-2 line', id: 'container' }
            }


        };
        const opts = this.ObjectMerge(defaults, options);
        let jsonComponents = {
            id: opts.id,
            class: opts.className,
            contenedor: [
                {
                    type: "div",
                    id: opts.card.name,
                    class: opts.card.class,
                    children: [
                        { class: opts.card.filterBar.className, id: opts.card.filterBar.id },
                        { class: opts.card.container.className, id: opts.card.container.id }
                    ],
                },
            ],
        };
        this.createPlantilla({ data: jsonComponents, parent: opts.parent, design: false });
    }

    splitLayout(options) {

        let defaults = {
            id: 'splitLayout',
            parent: this._div_modulo,
            className: "flex flex-col w-full p-1",


            card: {
                name: "singleLayout",
                class: "w-full",
                filterBar: { className: 'w-full  line', id: 'filterBar' },
                container: { className: 'w-full my-2 line', id: 'container' }
            }


        };
        const opts = this.ObjectMerge(defaults, options);


        let jsonComponents = {
            id: opts.id,
            class: opts.className,
            contenedor: [
                
                {
                    type: 'div',
                    id:  'header',
                    class: 'w-100 h-1/4 bg-info line ',
                }, 

                {
                    type: 'div',
                    id:  'container',
                    class: 'flex w-100 h-2/4 p-1',
                    children: [
                        { class: 'col-6 line', id: '' },
                        { class: 'col-6 line', id: '' }
                    ],
                }, 

                  
                {
                    type: 'div',
                    id:  'header',
                    class: 'w-100 h-1/4 bg-info line ',
                }, 

               



            ],
        };
        this.createPlantilla({ data: jsonComponents, parent: opts.parent, design: false });
    }



    verticalLinearLayout(options) {

        let defaults = {
            id: '',
            parent: this._div_modulo,
            className: "flex m-2 ",


            card: {
                id       : "singleLayout",
                className: "w-full",
                filterBar: { className: 'w-full  line', id: 'filterBar' },
                container: { className: 'w-full my-2 line', id: 'container' },
                footer   : { className: 'w-full my-2 line', id: 'footer' },
            }


        };


        const opts = this.ObjectMerge(defaults, options);
        let jsonComponents = {
            id: opts.id,
            class: opts.className,
            contenedor: [
                {
                    type: "div",
                    id: opts.card.id,
                    class: opts.card.className,
                    children: [
                        { class: opts.card.filterBar.className, id: opts.card.filterBar.id },
                        { class: opts.card.container.className, id: opts.card.container.id },
                        { class: opts.card.footer.className, id: opts.card.footer.id },
                    ],
                },
            ],
        };
        this.createPlantilla({ data: jsonComponents, parent: opts.parent, design: false });
    }

    secondaryLayout(components) {
        let nameComponent = {
            name: 'container',
            parent: this._div_modulo,
            className: 'flex p-2 ',
            cardtable: {
                className: 'col-4 line',
                id: 'containertable',
                filterBar: { id: 'filterTable', className: 'col-12 mb-2 line' },
                container: { id: 'listTable', className: 'col-12 line' },
            },
            cardform: {
                className: 'col-8 line',
                id: 'containertable',
                filterBar: { id: 'filterTicket', className: 'col-12 mb-2 line' },
                container: { id: 'containerTicket', className: 'col-12 line' },
            },
        };

        let ui = this.ObjectMerge(nameComponent, components);

        let jsonComponents = {
            id: ui.name,
            class: ui.className,

            contenedor: [
                {
                    type: 'div',
                    id: ui.cardform.id,
                    class: ui.cardform.className,
                    children: [
                        { class: ui.cardform.filterBar.className, id: ui.cardform.filterBar.id },
                        { class: ui.cardform.container.className, id: ui.cardform.container.id },
                    ],
                },
                {
                    type: "div",
                    id: ui.cardtable.id,
                    class: ui.cardtable.className,
                    children: [
                        { class: ui.cardtable.filterBar.className, id: ui.cardtable.filterBar.id },
                        { class: ui.cardtable.container.className, id: ui.cardtable.container.id },
                    ]
                },
            ],
        };

        this.createPlantilla({
            data: jsonComponents,
            parent: ui.parent,
            design: false
        });
    }




}


async function useFetch(options = {}) {

    // Valores predeterminados
    let defaults = {

        method: 'POST',
        data: { opc: 'ls' },
        url: '',
        success: null

    };

    // Mezclar los valores predeterminados con las opciones proporcionadas
    let opts = Object.assign({}, defaults, options);

    // Validar que la URL esté definida
    if (!opts.url) {
        console.error('URL es obligatoria.');
        return null;
    }

    try {
        // Realizar la petición fetch
        let response = await fetch(opts.url, {
            method: opts.method,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(opts.data),
        });

        // Procesar la respuesta como JSON
        let data = await response.json();

        // Si se proporciona el método success, lo ejecutamos con los datos obtenidos
        if (typeof opts.success === 'function') {
            opts.success(data);
        }

        // Retornar los datos por si se quieren usar fuera de la función success
        return data;
    } catch (error) {
        console.error('Error en la petición:', error);
        return null;
    }
}


function photoReceta() {
    let file = $("#photo-receta")[0].files[0];

    console.log(file)

    if (file) {
        $("#content_photo span").css({ display: "flex" });
        $("#content_photo span").html(
            '<i class="animate-spin icon-spin6"></i> '
        );
        setTimeout(() => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            $("#content_photo span").hide();
            $("#content_photo span").removeAttr("style");
            $("#content_photo span").addClass("text-uppercase");
            $("#content_photo span").html('<i class="icon-edit"></i>');
            reader.onload = function (e) {
                $("#img-photo").attr("src", e.target.result);
            };
        }, 500);
    }
}


