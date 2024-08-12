    ejercicioMensualx() {
        let mes_actual = $('#Mes option[value="' + $("#Mes").val() + '"]').text();
        let mes_proximo = $(
            '#Mes option[value="' + (parseInt($("#Mes").val()) + 1) + '"]'
        ).text();

        this.attr_question = {
            title:
                '¿Deseas crear el ejercicio mensual de  <span class="text-success">' +
                mes_proximo +
                " </span> ?",
            html:
                'Ten en cuenta que se utilizarán los datos del mes de <span class="text-primary fw-bold">' +
                mes_actual +
                "</span> como base para este nuevo ejercicio.",
        };

        this.modal_question({ extends: true }).then((result) => {
            if (result.isConfirmed) {
                this.dataSearchTable = { opc: "ejercicioMensual" };

                this.searchTable({ extends: true }).then((data) => {
                    if (data.created) {
                        alert({
                            icon: "info",
                            title:
                                "Ya existe un ejercicio mensual para el mes de " + mes_proximo,
                        });
                    } else {
                        alert({
                            icon: "info",
                            title:
                                "Se creo el ejercicio mensual de " + mes_proximo + " con éxito",
                            timer: 2500,
                        });

                        $("#tbDatos").rpt_json_table2({ data: data });
                    }
                });
            }
        });
    }
