package vg.samuel.justiniani.hackathon.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vg.samuel.justiniani.hackathon.model.FichaBibliografica;
import vg.samuel.justiniani.hackathon.service.FichasBibliograficaService;

import java.util.List;

@RestController
@RequestMapping("/api/fichas")
@RequiredArgsConstructor
public class FichasBibliograficaController {

    private final FichasBibliograficaService fichasService;

    @GetMapping
    public List<FichaBibliografica> getAll() {
        return fichasService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FichaBibliografica> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(fichasService.findById(id));
    }

    @PostMapping
    public ResponseEntity<FichaBibliografica> create(@RequestBody FichaBibliografica ficha) {
        return ResponseEntity.ok(fichasService.save(ficha));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FichaBibliografica> update(@PathVariable Integer id, @RequestBody FichaBibliografica ficha) {
        return ResponseEntity.ok(fichasService.update(id, ficha));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        fichasService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/restore/{id}")
    public ResponseEntity<FichaBibliografica> restore(@PathVariable Integer id) {
        return ResponseEntity.ok(fichasService.restore(id));
    }

    @GetMapping("/estado/{estado}")
    public List<FichaBibliografica> getByEstado(@PathVariable Boolean estado) {
        return fichasService.findByEstado(estado);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> getPdfReport() throws Exception {
        byte[] pdf = fichasService.generateJasperPdfReport();
        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=fichas.pdf")
                .body(pdf);
    }

}
