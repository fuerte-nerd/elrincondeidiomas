const Datastore = require('nedb');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');

module.exports = (selection, invoiceDate)=>{

    // Font variables
    const fontRegular = "Helvetica";
    const fontBold = `${fontRegular}-Bold`;

    // Month array
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Path info
    const folderName = `Invoices for ${months[invoiceDate.month]} ${invoiceDate.year}`;
    const folderPath = path.join(__dirname, `../../docs/${folderName}`);
    
    //Check if directory to save into already exists and create if needed
    fs.access(folderPath,(err)=>{
        if(err){
            fs.mkdirSync(folderPath)
        }
    })

    // Create the students NEDB datastore
    const student_db = new Datastore({
        filename : path.join(__dirname, '../../nedb/students.db'),
        autoload : true
    });

    // Create the students NEDB datastore
    const class_db = new Datastore({
        filename : path.join(__dirname, '../../nedb/class.db'),
        autoload : true
    })

    // Create the payments NEDB datastore
    const paymentsDB = new Datastore({
        filename : path.join(__dirname, '../../nedb/payments.db'),
        autoload : true
    })

    selection.forEach(student => {
        // Retrieve student details from DB
        student_db.findOne({ _id: student.id },(err, record)=>{
            if(err){ console.log(err) }
            else{
                // Create Document
                const doc = new PDFDocument({ size: 'A4'});
                const filePath = path.join(folderPath, `./${record.first_names} ${record.second_names} - ${months[invoiceDate.month]} ${invoiceDate.year}.pdf`);
                if(fs.existsSync(filePath)){
                    fs.unlinkSync(filePath);
                }
                // Create writestream
                doc.pipe(fs.createWriteStream(filePath));
        
                // Add Logo
                doc.image(path.join(__dirname, '../../html/assets/logo.png'), 70, 50,{
                    width: 180
                });
                
                // Declare start font
                doc.font(fontRegular);

                // Populate company name, address and contact details
                doc.text('El Rincón de Idiomas',{ align: 'right' })
                doc.text('Calle Alcaldes Mayores, 1',{ align: 'right' })
                doc.text('6 Majada Marcial',{ align: 'right' })
                doc.text('Puerto del Rosario',{ align: 'right' })
                doc.text('35600',{ align: 'right' })
                doc.moveDown()
                doc.text('636 32 34 41',{ align: 'right' })
                doc.text('elrincondeidiomas@gmail.com',{ align: 'right' })
                doc.moveDown();
                doc.fontSize(10)
                doc.text('Director: Joanne Bowker',{ align: 'right' })
                doc.text('X2016168B', { align: 'right'})
        
                doc.moveDown()
                doc.fontSize(12)

                // Generate and populate date
                const date = new Date();
                const spanishMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
                const str = `${date.getDate()} de ${spanishMonths[date.getMonth()]} de ${date.getFullYear()}`;
                
                doc.text(str, { align: 'right' })
                
                doc.moveDown()

                // Populate client name and address
                doc.fontSize(12);
                doc.text(`${record.first_names} ${record.second_names}`)
                doc.text(record.street_address)
                doc.text(record.towncity)
                doc.text(record.postcode)

                doc.moveDown();

                doc.font(fontRegular)
                .fontSize(8)
                .text(`Ref: ${ record._id }`)
                
                doc.moveDown();
                
                // Populate heading
                doc.font(fontBold)
                    .fontSize(14)
                    .text(`FACTURA`, {
                    align: 'center',
                    underline: true
                })
                
                doc.moveDown(2);
                doc.fontSize(12);

                // Invoice area
                doc.text('Descripción', {continued: true}).text('Precio', {align: 'right'})
                doc.image(path.join(__dirname, '../../html/assets/thinline.png'),{ width: doc.page.width - (doc.page.margins.left * 2), height: .5, align: 'center'});
        
                doc.moveDown();

                var monthlyAmount = 0;
                // Populate monthly amount
                class_db.find({ attendees: record._id }, (err, records)=>{
                    if(err){ console.log(err) }
                    else{
                        records.forEach(classRecord => {
                            monthlyAmount += parseInt(classRecord.amount)
                        });
                        doc.font(fontRegular)
                        doc.text(`Clases por el mes de ${spanishMonths[invoiceDate.month]}`, {continued: true}).text(`${monthlyAmount.toFixed(2)}€`, {align: 'right'})

                        var discount = 0;
                        var reduction = 0;
                
                        // Populate deductions/additions (if applicable)
                        if(student.reduction){
                            reduction = parseInt(student.reduction);

                            doc.moveDown()
                            doc.text(student.reason, { continued: true })
                            .text(`${reduction.toFixed(2)}€`, { align: 'right' })
                        }

                        // Populate discount (if applicable)
                        if(record.discount != ''){
                            discount = parseInt(record.discount);

                            doc.moveDown()
                            doc.text('Descuento', { continued: true })
                            .text(`-${discount.toFixed(2)}€`, { align: 'right' })
                        }
                       
                        doc.moveDown()
                        doc.image(path.join(__dirname, '../../html/assets/thinline.png'),{ width: doc.page.width - (doc.page.margins.left * 2), height: .5, align: 'center'});
                        doc.moveDown(2);

                        
                        
                        // Total section
                        let total = monthlyAmount - discount + reduction;                       
                        doc.font(fontBold);
                        doc.text('Total', { continued: true}).fontSize(14).text(`${total.toFixed(2)}€`, { align: 'right' })
                        doc.image(path.join(__dirname, '../../html/assets/thickline.png'),{ width: doc.page.width - (doc.page.margins.left * 2), height: .75, align: 'center'});
                        
                        doc.moveDown();


                        doc.fontSize(11);
                        doc.text(`Por favor asegúrese de que recibamos el pago antes del 5 de ${spanishMonths[date.getMonth() + 1]} de ${date.getFullYear()}`, { align: 'center' })
                        doc.moveDown();
                        doc.font(fontRegular).text('Para pagar por transferencia bancaria, por favor utilice los siguientes datos:', { align: 'center' })
                        .text('ES41 0081 0695 5700 0170 4173', { align: 'center' }).moveDown();
                        doc.fontSize(10).text('Gracias por su pago y confianza en nuestra Academia.', { align : 'center'})
                        doc.moveDown(2);


                        doc.image(path.join(__dirname, '../../html/assets/dashedline.png'),{ width: doc.page.width - (doc.page.margins.left * 2), height: .75, align: 'center'});

                        doc.moveDown();
                        doc.fontSize(9).text('Si está pagando en efectivo, corte esta sección y adjunte el pago en el sobre suministrado. Gracias.', {align: 'center'})

                        // Open new payment
                        
                    
                        paymentsDB.insert({
                            student : record._id,
                            period : new Date(invoiceDate.year, invoiceDate.month, 1),
                            date_issued : new Date(),
                            monthly_amount : monthlyAmount.toFixed(2),
                            reductions_additions : reduction.toFixed(2),
                            discount : discount.toFixed(2),
                            payment : {
                                pay_date : null,
                                method : null
                            },
                            cancel : {
                                isCancelled : false,
                                cancellationReason : null
                            }
                        }, (err, newPayment)=>{
                            doc.moveDown();
                            // Thank you message
                            doc.fontSize(8)
                            .text(`Pago ref: ${newPayment._id}`, { continued : true})
                            .fontSize(12)
                            .text('Recibido por:', { align: 'right'})
                            doc.fontSize(10)
                            .text(`Estudiante: ${record.first_names} ${record.second_names}`)
                            .text(`Cantidad debida: ${total.toFixed(2)}€`).moveDown()
                            .text('Cantidad en efectivo: ............................€', { continued: true}).fontSize(7).text('  (Por favor completa)')
                            doc.moveDown();
                            
                        
                            // Save PDF
                            doc.end();
                        })

                        

                        
                    }
                })
            }
        })
    })
}