import os
import glob
import re

dto_files = [
    # Organization
    "src/app/workspace/database/organization/area-types/area-type.dto.ts",
    "src/app/workspace/database/organization/areas/area.dto.ts",
    "src/app/workspace/database/organization/branches/branch.dto.ts",
    "src/app/workspace/database/organization/fuel-stations/fuel-station.dto.ts",
    "src/app/workspace/database/organization/institutions/institution.dto.ts",
    "src/app/workspace/database/organization/official-recipients/official-recipient.dto.ts",
    "src/app/workspace/database/organization/partidas/partida.dto.ts",
    "src/app/workspace/database/organization/projects/project.dto.ts",
    "src/app/workspace/database/organization/suppliers/supplier.dto.ts",
    
    # RH
    "src/app/workspace/database/rh/adscriptions/adscription.dto.ts",
    "src/app/workspace/database/rh/employees/employee.dto.ts",
    "src/app/workspace/database/rh/job-positions/job-position.dto.ts",
    "src/app/workspace/database/rh/persons/person.dto.ts",
    
    # Location
    "src/app/workspace/database/location/cities/city.dto.ts",
    "src/app/workspace/database/location/countries/country.dto.ts",
    "src/app/workspace/database/location/states/state.dto.ts",
    
    # Logistics
    "src/app/workspace/database/logistica/cars/car.dto.ts",
    "src/app/workspace/database/logistica/distances/distance.dto.ts",
    "src/app/workspace/database/logistica/tariffs/tariff.dto.ts",
    "src/app/workspace/database/logistica/toll-booths/toll-booth.dto.ts",
    
    # Core
    "src/app/core/models/location.dto.ts",
    "src/app/core/models/notification.dto.ts",

    # Operatividad
    "src/app/workspace/operatividad/documentos/interfaces/document-inbox.dto.ts",

    # System
    "src/app/workspace/system/security/document-types/document-type-catalog.dto.ts",
    "src/app/workspace/system/security/internal-templates/internal-template.dto.ts",
    "src/app/workspace/system/security/templates/document-template.dto.ts",
]

for filepath in dto_files:
    if not os.path.exists(filepath):
        # En Windows a veces hay un desfase de mayúsculas/minúsculas o nombres sutiles, así que buscaré usando glob por si acaso
        # print(f"Skipping {filepath} (does not exist)")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if already processed
    if "IBaseEntity" in content:
        print(f"Skipping {filepath} (already has IBaseEntity)")
        continue
        
    # Find the main exported class
    match = re.search(r"export\s+class\s+(\w+)\s*\{", content)
    if not match:
        print(f"No exported class found in {filepath}")
        continue
        
    class_name = match.group(1)
    
    # Import
    import_stmt = "import { IBaseEntity, BaseDto } from '@core/models/base-entity.dto';\n\n"
    
    # Replace class declaration
    new_class_decl = f"export class {class_name} extends BaseDto<{class_name}> implements IBaseEntity {{"
    
    content = content[:match.start()] + new_class_decl + content[match.end():]
    content = import_stmt + content
    
    # Add super() in constructor
    const_match = re.search(r"constructor\s*\([^\)]*\)\s*\{", content)
    if const_match:
        content = content[:const_match.end()] + "\n    super();" + content[const_match.end():]
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Refactored {filepath}")
